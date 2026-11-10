"""Hand-written review lines, combined per product.

Each review = an opener matched to the star rating + one or two category-specific
details. Deterministic (seeded by product id) so every database gets the same
reviews and re-running produces no surprises.
"""
import random

# Fictional reviewer personas. "w"/"m" marks which department's products the
# persona reviews, so fit comments like "tight at the chest" on a dress don't
# come from a men's-wear shopper.
DEMO_USERS = [
    ("Aarav", "Sharma", "m"), ("Diya", "Patel", "w"), ("Rohan", "Mehta", "m"),
    ("Ananya", "Iyer", "w"), ("Kabir", "Singh", "m"), ("Meera", "Nair", "w"),
    ("Vihaan", "Gupta", "m"), ("Ishita", "Reddy", "w"), ("Arjun", "Kulkarni", "m"),
    ("Sneha", "Joshi", "w"), ("Aditya", "Rao", "m"), ("Priya", "Desai", "w"),
    ("Karan", "Malhotra", "m"), ("Riya", "Chatterjee", "w"), ("Nikhil", "Verma", "m"),
]

WOMENS = {"women_kurta", "saree", "lengha_choli", "women_dress", "women_jeans", "top"}

OPENERS = {
    5: ["Absolutely love it!", "Exceeded my expectations.", "Totally worth the price.",
        "Best purchase this month.", "Superb quality.", "Five stars, no doubt."],
    4: ["Really good overall.", "Very happy with this.", "Good value for money.",
        "Nice product, would buy again.", "Pretty impressed."],
    3: ["It's okay.", "Decent for the price.", "Average, nothing special.",
        "Mixed feelings about this one."],
    2: ["Not what I expected.", "A bit disappointed.", "Could have been better."],
}

# Category -> {"good": [...], "bad": [...]}; "bad" lines are used for 2-3 stars.
DETAILS = {
    "tee": {
        "good": ["Fabric is soft and breathable.", "Fit is true to size.",
                 "Colour hasn't faded after several washes.", "Neckline holds its shape.",
                 "Comfortable for the whole day.", "Stitching feels solid.",
                 "Looks great with jeans.", "Thickness is just right, not see-through."],
        "bad": ["Shrank a little after the first wash.", "Runs slightly small, size up.",
                "Fabric is thinner than I hoped.", "Colour is a shade different from the photo."],
    },
    "hoodie": {
        "good": ["Really warm without being bulky.", "Inside fleece is super soft.",
                 "Hood is a good size and has proper drawcords.", "Perfect for winter mornings.",
                 "Pocket is roomy.", "Cuffs are snug and don't stretch out.",
                 "Oversized fit looks exactly like the photo."],
        "bad": ["Pilled a bit after a few washes.", "Sleeves are a little long.",
                "Heavier than expected for Indian weather.", "Zip feels a bit cheap."],
    },
    "kurta": {
        "good": ["Fabric is light and perfect for summer.", "Print is even prettier in person.",
                 "Got so many compliments at the function.", "Fits beautifully at the shoulders.",
                 "Embroidery work is neat.", "Length is perfect with leggings.",
                 "Colour is rich and didn't bleed."],
        "bad": ["Needed alteration at the waist.", "Colour bled slightly in the first wash.",
                "Fabric creases very easily.", "Length is shorter than mentioned."],
    },
    "saree": {
        "good": ["Drapes beautifully.", "Border work is lovely.", "Fabric feels premium.",
                 "Blouse piece is good quality.", "Colour is exactly as shown.",
                 "Lightweight and easy to carry all day."],
        "bad": ["Fall and pico not included.", "Fabric is a bit stiff.",
                "Colour is slightly duller than the photo."],
    },
    "lehenga": {
        "good": ["Looked stunning at my cousin's wedding.", "Flare is gorgeous when you twirl.",
                 "Embroidery is detailed and neat.", "Dupatta is soft and long enough.",
                 "Choli fit perfectly.", "Felt like a designer piece at this price."],
        "bad": ["Quite heavy to wear for long hours.", "Choli needed alteration.",
                "Some threads were loose."],
    },
    "dress": {
        "good": ["Fits like a dream.", "Fabric flows nicely.", "Perfect for a summer outing.",
                 "Got compliments all evening.", "Length is just right.",
                 "Material doesn't wrinkle much."],
        "bad": ["Runs a little tight at the chest.", "Fabric is slightly see-through.",
                "Length is shorter than expected."],
    },
    "shirt": {
        "good": ["Crisp fabric, looks smart at the office.", "Collar stays in shape.",
                 "Fit is sharp without being tight.", "Easy to iron.",
                 "Buttons are sewn on well.", "Breathable even on humid days."],
        "bad": ["Sleeves are a little short.", "Wrinkles quickly.",
                "Slim fit is tighter than expected."],
    },
    "jeans": {
        "good": ["Stretch is comfortable for all-day wear.", "Fit is perfect at the waist.",
                 "Wash looks premium.", "Denim feels sturdy.", "Length is ideal, no alteration needed."],
        "bad": ["Colour faded a bit after washing.", "Waist runs small.",
                "Fabric is stiffer than expected."],
    },
    "top": {
        "good": ["Cute and comfortable.", "Fabric is soft.", "Great for college and casual outings.",
                 "Fit is flattering.", "Colour is lovely."],
        "bad": ["Fabric is thin.", "Runs small.", "Stitching came loose at the hem."],
    },
}

CATEGORY_GROUP = {
    "mens_tshirt": "tee", "mens_hoodie": "hoodie", "women_kurta": "kurta",
    "mens_kurta": "kurta", "saree": "saree", "lengha_choli": "lehenga",
    "women_dress": "dress", "shirt": "shirt", "men_jeans": "jeans",
    "women_jeans": "jeans", "top": "top",
}

CLOSERS = ["Delivery was quick.", "Packaging was neat.", "", "", ""]
HAPPY_CLOSERS = CLOSERS + ["Would recommend.", "Will order another colour."]


def reviews_for(product_id, category, count=None):
    """Return [(user_index, rating, text)] for one product."""
    rng = random.Random(product_id)
    group = DETAILS[CATEGORY_GROUP.get(category, "top")]
    n = count if count is not None else rng.randint(2, 5)
    dept = "w" if category in WOMENS else "m"
    pool_users = [i for i, u in enumerate(DEMO_USERS) if u[2] == dept]
    users = rng.sample(pool_users, min(n, len(pool_users)))

    out = []
    for u in users:
        # Skewed like real shops: mostly 4-5 stars, the odd 2-3.
        rating = rng.choices([5, 4, 3, 2], weights=[45, 35, 14, 6])[0]
        pool = group["good"] if rating >= 4 else group["bad"] + group["good"][:2]
        details = rng.sample(pool, 2 if rating != 3 else 1)
        text = " ".join(p for p in [rng.choice(OPENERS[rating]), *details, rng.choice(HAPPY_CLOSERS if rating >= 4 else CLOSERS)] if p)
        out.append((u, rating, text[:255]))
    return out
