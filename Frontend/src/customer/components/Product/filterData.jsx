export const filters = [
    {
        id: "color",
        name: "Color",
        options: [
            { value: "black", label: "Black" },
            { value: "gray", label: "Gray" },
            { value: "orange", label: "Orange" },
            { value: "pink", label: "Pink" },
            { value: "dark blue", label: "Dark Blue" },
            { value: "red", label: "Red" },
            { value: "white", label: "White" },
            { value: "beige", label: "Beige" },
            { value: "blue", label: "Blue" },
            { value: "brown", label: "Brown" },
            { value: "green", label: "Green" },
            { value: "purple", label: "Purple" },
            { value: "yellow", label: "Yellow" }
        ],
    },
    {
        id: "size",
        name: "Size",
        options: [
            { value: "S", label: "S" },
            { value: "M", label: "M" },
            { value: "L", label: "L" },
        ],
    },
]
export const singleFilter = [
    {
        id: "price",
        name: "Price",
        options: [
           { value: "159-399", label: "₹159 To ₹399" },
            { value: "399-999", label: "₹399 To ₹999" },
            { value: "999-1999", label: "₹999 To ₹1,999" },
            { value: "1999-2999", label: "₹1,999 To ₹2,999" },
            { value: "3999-4999", label: "₹3,999 To ₹4,999" },
        ],
    },

    {
        id: "stock",
        name: "Availability",
        options: [
            { value: "in_stock", label: "In Stock" },
            { value: "out_of_stock", label: "Out Of Stock" },
        ],
    },
];