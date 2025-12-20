export const navigation = {
    categories: [
      {
        id: 'women',
        name: 'Women',
        featured: [
          // {
          //   name: 'New Arrivals',
          //   href: '/',
          //   imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg',
          //   imageAlt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
          // },
          // {
          //   name: 'Basic Tees',
          //   href: '/',
          //   imageSrc: 'https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg',
          //   imageAlt: 'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
          // },
        ],
        sections: [
          {
            id: 'clothing',
            name: 'Clothing',
            items: [
              { name: 'Tops', id:"top", href: `{women/clothing/tops}` },
              { name: 'Dresses', id:"women_dress", href: '#' },
              { name: 'Women Jeans', id: 'women_jeans' },
              // { name: 'Lengha Choli', id: 'lengha_choli' },
              // { name: 'Sweaters', id: 'women_sweater' },
              // { name: 'T-Shirts', id: 'women_tshirt' },
              // { name: 'Jackets', id: 'women_jacket' },
              // { name: 'Gouns', id: 'gouns' },
              { name: 'Sarees', id: 'saree' },
              // { name: 'Kurtas', id: 'women_kurtas' },
            ],
          },
          // {
          //   id: 'accessories',
          //   name: 'Accessories',
          //   items: [
          //     { name: 'Watches', id: 'women_watch' },
          //     { name: 'Wallets', id: 'women_wallet' },
          //     { name: 'Bags', id: 'women_bag' },
          //     { name: 'Sunglasses', id: 'women_sunglasses' },
          //     { name: 'Hats', id: 'women_hat' },
          //     { name: 'Belts', id: 'women_belt' },
          //   ],
          // },
          // {
          //   id: 'brands',
          //   name: 'Brands',
          //   items: [
          //     { name: 'Full Nelson', id: '#' },
          //     { name: 'My Way', id: '#' },
          //     { name: 'Re-Arranged', id: '#' },
          //     { name: 'Counterfeit', id: '#' },
          //     { name: 'Significant Other', id: '#' },
          //   ],
          // },
        ],
      },
      {
        id: 'men',
        name: 'Men',
        featured: [
          // {
          //   name: 'New Arrivals',
          //   id: '/Product/53',
          //   imageSrc: 'https://rukminim1.flixcart.com/image/612/612/xif0q/kurta/u/g/z/xl-8button-kurta-elepants-original-imagk57kfg2bwvhd.jpeg?q=70',
          //   imageAlt: 'A traditional, elegant garment with fine fabric, intricate embroidery, and a relaxed, stylish fit.',
          // },
          // {
          //   name: 'Artwork Tees',
          //   id: '#',
          //   imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-02-image-card-06.jpg',
          //   imageAlt:
          //     'Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.',
          // },
        ],
        sections: [
          {
            id: 'clothing',
            name: 'Clothing',
            items: [
              { name: 'Mens Kurtas', id: 'mens_kurta' },
              { name: 'Shirt', id: 'shirt' },
              { name: 'Men Jeans', id: 'men_jeans' },
              // { name: 'Sweaters', id: 'mens_sweaters' },
              // { name: 'T-Shirts', id: 'mens_tshirt' },
              // { name: 'Jackets', id: 'mens_jacket' },
              // { name: 'Activewear', id: 'mens_activewear' },

            ],
          },
          // {
          //   id: 'accessories',
          //   name: 'Accessories',
          //   items: [
          //     { name: 'Watches', id: 'mens_watch' },
          //     { name: 'Wallets', id: 'mens_wallet' },
          //     { name: 'Bags', id: 'mens_bag' },
          //     { name: 'Sunglasses', id: 'mens_sunglasses' },
          //     { name: 'Hats', id: 'mens_hat' },
          //     { name: 'Belts', id: 'mens_belt' },
          //   ],
          // },
          // {
          //   id: 'brands',
          //   name: 'Brands',
          //   items: [
          //     { name: 'Re-Arranged', id: '#' },
          //     { name: 'Counterfeit', id: '#' },
          //     { name: 'Full Nelson', id: '#' },
          //     { name: 'My Way', id: '#' },
          //   ],
          // },
        ],
      },
    ],
    // pages: [
    //   { name: 'Company', id: '/' },
    //   { name: 'Stores', id: '/' },
    // ],
  }