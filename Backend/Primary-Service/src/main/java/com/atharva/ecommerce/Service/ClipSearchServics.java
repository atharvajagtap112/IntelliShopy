package com.atharva.ecommerce.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
public class ClipSearchServics {

    // A bare `new RestTemplate()` has NO timeout at all. The Hugging Face Space
    // sleeps when idle, so a cold call can hang for minutes - and every hung call
    // pins a Tomcat thread until the client gives up. Read timeout is generous
    // (60s) because a cold wake plus CLIP inference legitimately takes ~30s;
    // connect timeout is short because a refused connect is never slow.
    private final RestTemplate restTemplate;

    // Local: CLIP_SERVICE_URL=http://localhost:8000
    private final String baseUrl;

    public ClipSearchServics(@Value("${clip.service.url}") String baseUrl) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(10));
        factory.setReadTimeout(Duration.ofSeconds(60));
        this.restTemplate = new RestTemplate(factory);
        this.baseUrl = baseUrl.replaceAll("/+$", "");
    }

    public List<Long> search(MultipartFile image) throws Exception {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(image.getBytes()) {
            @Override
            public String getFilename() {
                return image.getOriginalFilename();
            }
        });

        HttpEntity<MultiValueMap<String, Object>> request =
                new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                baseUrl + "/search",
                request,
                Map.class
        );

        return productIds(response);
    }

    // Text -> CLIP text embedding -> nearest product images. Finds products by
    // what they look like ("floral summer dress"), which the LLM filter search
    // can't do: it only understands category / colour / size / price.
    public List<Long> searchByText(String query) {
        // A URI, not a String: RestTemplate would encode a String URL a second time.
        URI url = UriComponentsBuilder.fromUriString(baseUrl + "/search/text")
                .queryParam("q", query)
                .queryParam("k", 20)
                .encode()
                .build()
                .toUri();

        return productIds(restTemplate.getForEntity(url, Map.class));
    }

    private static List<Long> productIds(ResponseEntity<Map> response) {
        // If the Space is waking up or errored it answers with a different shape,
        // and the old code NPE'd on the missing key instead of saying so.
        Object ids = response.getBody() == null ? null : response.getBody().get("productIds");
        if (!(ids instanceof List<?> list)) {
            throw new IllegalStateException("Image search service returned no productIds: " + response.getBody());
        }

        return list.stream()
                .map(id -> Long.valueOf(id.toString()))
                .toList();
    }
}
