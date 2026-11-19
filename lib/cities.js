// Nearby cities that get their own landing page at /used-cars/[slug].
// Distances are straight-line from the lot (4413 S Beech Daly St) to each
// city centre, rounded, with typical drive times. Keep the copy specific to
// each city: near-identical city pages read as doorway pages to Google.

export const DEALER_ADDRESS = '4413 S Beech Daly St, Dearborn Heights, MI 48125'

export const CITIES = {
  dearborn: {
    name: 'Dearborn',
    miles: 'about 7 miles',
    drive: 'around 15 minutes',
    direction: 'southwest of Dearborn',
    intro: [
      'Dearborn is our closest big neighbour. The lot is on South Beech Daly in Dearborn Heights, around 15 minutes southwest of central Dearborn, so it is an easy trip on a lunch break or after work.',
      'Dearborn is Ford country, and a lot of buyers here want a Ford, a GM truck or a family SUV that holds up to Michigan winters. We keep a mix of SUVs, sedans and work vehicles, every one listed online with its real price before you make the drive.',
    ],
    faqs: [
      {
        q: 'How far is Connect Auto Sales from Dearborn?',
        a: 'We are about 7 miles southwest of central Dearborn, around 15 minutes by car. The address is 4413 S Beech Daly St, Dearborn Heights, MI 48125.',
      },
      {
        q: 'Can Dearborn buyers with bad credit get financed here?',
        a: 'Yes. We work with bad credit, no credit and first-time buyers through our lender network, and offer in-house financing on select vehicles for qualified buyers. You can apply online before you drive over.',
      },
    ],
  },
  inkster: {
    name: 'Inkster',
    miles: 'about 2 miles',
    drive: 'around 5 minutes',
    direction: 'right next to Inkster',
    intro: [
      'Inkster shares a border with Dearborn Heights, and our lot is only about 2 miles from the centre of Inkster. For most Inkster drivers we are the closest independent used car dealer, five minutes away rather than a trip across the county.',
      'Being this close matters after the sale too. If a warning light comes on or you have a question about your warranty, you can swing by instead of calling a dealership you will never see again.',
    ],
    faqs: [
      {
        q: 'How far is Connect Auto Sales from Inkster?',
        a: 'About 2 miles southeast of central Inkster, around 5 minutes by car. We are at 4413 S Beech Daly St in Dearborn Heights.',
      },
      {
        q: 'Do you accept trade-ins from Inkster buyers?',
        a: 'Yes, trade-ins are welcome. Bring the vehicle and its title when you come in and we will give you a number on the spot.',
      },
    ],
  },
  taylor: {
    name: 'Taylor',
    miles: 'about 3 miles',
    drive: 'around 8 minutes',
    direction: 'just north of Taylor',
    intro: [
      'Taylor sits directly south of Dearborn Heights, and our lot is about 3 miles from the middle of Taylor, around 8 minutes by car.',
      'Taylor buyers often come to us for a reliable daily driver on a budget. A large share of our lot is under $10,000, and every car is listed online with its real price and 15 to 20 photos, so you know what you are coming to see.',
    ],
    faqs: [
      {
        q: 'How far is Connect Auto Sales from Taylor?',
        a: 'About 3 miles, around 8 minutes by car. Head north toward Dearborn Heights; we are at 4413 S Beech Daly St.',
      },
      {
        q: 'Do you have used cars under $10,000 for Taylor buyers?',
        a: 'Yes. A good part of our inventory is under $10,000, and financing and warranty options are available on those vehicles too.',
      },
    ],
  },
  westland: {
    name: 'Westland',
    miles: 'about 7 miles',
    drive: 'around 15 minutes',
    direction: 'southeast of Westland',
    intro: [
      'Westland is about 15 minutes northwest of our lot in Dearborn Heights. If you are comparing used car prices across western Wayne County, it is a short drive to see what we have.',
      'Every vehicle on our site shows its actual price, mileage, title type and a full photo set, so you can shortlist from home in Westland and only make the trip once you have found the one you want to drive.',
    ],
    faqs: [
      {
        q: 'How far is Connect Auto Sales from Westland?',
        a: 'About 7 miles, around 15 minutes by car. We are at 4413 S Beech Daly St, Dearborn Heights, MI 48125.',
      },
      {
        q: 'Can I check a car is still available before driving from Westland?',
        a: 'Yes, and we recommend it. Call or text us with the stock number from the listing and we will confirm it is on the lot and ready for a test drive.',
      },
    ],
  },
  'garden-city': {
    name: 'Garden City',
    miles: 'about 4 miles',
    drive: 'around 10 minutes',
    direction: 'southeast of Garden City',
    intro: [
      'Garden City is a short drive northwest of our lot, about 4 miles from the centre of town and around 10 minutes by car. It is a good fit if you need an affordable second car for the family or a first car for a new driver.',
      'For first-time buyers we keep it simple: real prices online, financing that works with no credit history, and warranty options so a young driver is not left with a big repair bill.',
    ],
    faqs: [
      {
        q: 'How far is Connect Auto Sales from Garden City?',
        a: 'About 4 miles, around 10 minutes by car. We are at 4413 S Beech Daly St in Dearborn Heights.',
      },
      {
        q: 'Do you help first-time buyers from Garden City?',
        a: 'Yes. We work with first-time buyers and buyers with no credit history, and we can walk you through financing and warranty options before you commit.',
      },
    ],
  },
}

export const CITY_SLUGS = Object.keys(CITIES)
