package com.atharva.ecommerce.DTO;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;

import java.util.List;
import java.util.Set;

// Structured output target for the AI search. Spring AI derives a JSON schema from
// this record (descriptions included) and Gemini fills it, so we never parse
// free-form model text by hand. Field names match what the frontend's
// findProducts() already sends, so the WebSocket contract is unchanged.
@JsonInclude(JsonInclude.Include.NON_NULL)
public record SearchFilters(
        @JsonPropertyDescription("One of the allowed category keys, or empty string if none matches")
        String category,
        @JsonPropertyDescription("Lowercase colour names mentioned in the query")
        List<String> colors,
        @JsonPropertyDescription("Sizes from XS, S, M, L, XL, XXL, XXXL")
        List<String> sizes,
        Integer minPrice,
        Integer maxPrice,
        Integer minDiscount,
        Integer maxDiscount,
        @JsonPropertyDescription("price_low or price_high")
        String sort,
        Integer pageNumber,
        @JsonPropertyDescription("in_stock or out_of_stock")
        String stock,
        Integer pageSize,
        @JsonPropertyDescription("Set only when nothing meaningful could be extracted")
        String unrecognizedText
) {

    public static final Set<String> CATEGORIES = Set.of(
            "mens_kurta", "shirt", "men_jeans", "mens_tshirt", "mens_hoodie",
            "saree", "lengha_choli", "women_dress", "women_jeans", "top", "women_kurta");

    private static final Set<String> SIZES = Set.of("XS", "S", "M", "L", "XL", "XXL", "XXXL");

    // The model's output is untrusted input to our product query. Fill defaults for
    // anything it left out and drop values the backend would not understand, so a
    // hallucinated category or sort can never reach the repository. Paging is
    // always ours to decide, not the model's.
    public SearchFilters normalized() {
        String cat = category == null ? "" : category.trim().toLowerCase();
        return new SearchFilters(
                CATEGORIES.contains(cat) ? cat : "",
                colors == null ? List.of() : colors.stream().map(c -> c.trim().toLowerCase()).toList(),
                sizes == null ? List.of() : sizes.stream().map(s -> s.trim().toUpperCase()).filter(SIZES::contains).toList(),
                minPrice == null || minPrice < 0 ? 0 : minPrice,
                maxPrice == null || maxPrice <= 0 ? 10_000_000 : maxPrice,
                minDiscount == null || minDiscount < 0 ? 0 : minDiscount,
                maxDiscount == null || maxDiscount <= 0 ? 100_000 : maxDiscount,
                "price_high".equals(sort) ? "price_high" : "price_low",
                0,
                "out_of_stock".equals(stock) ? "out_of_stock" : "in_stock",
                10,
                unrecognizedText == null || unrecognizedText.isBlank() ? null : unrecognizedText);
    }
}
