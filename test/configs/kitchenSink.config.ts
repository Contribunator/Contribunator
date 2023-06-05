import * as Yup from "yup";

import genericConfig from "@/contributions/generic/config";
import getImageType from "@/lib/getImageType";
import { FaSink } from "react-icons/fa";

export default genericConfig({
  icon: FaSink,
  title: "Kitchen Sink",
  description: "A test form with all the fields",
  useFilesOnServer: {
    hello: "test/hello.json",
  },
  options: {
    title: "Taxi Booking",
    description: "The ultimate taxi service booking form",
    commit: async ({ body, timestamp, files }) => {
      // todo convencience method for pulling out image data
      const commit = {
        files: {
          "hello.txt": `Hello, world! ${timestamp}`,
        },
        // todo, getImageType should be automatic...
        ...(body.image && {
          images: { [`cat.${getImageType(body.image)}`]: body.image },
        }),
      };
      return commit;
    },
    fields: {
      // TODO collections
      name: {
        type: "text",
        title: "Enter your name",
        placeholder: "This is my name",
      },
      pickup: {
        type: "text",
        as: "textarea",
        title: "Enter your pickup point",
        placeholder: "Enter your pets here",
        validation: {
          required: "Must tell me your pet!",
        },
      },
      vehicle: {
        type: "choice",
        title: "Choose a Vehicle",
        validation: {
          required: "You must choose an vehicle!",
        },
        options: {
          car: {
            title: "Car",
          },
          truck: {
            title: "Truck",
          },
          bike: {
            title: "Bike",
          },
          hovercraft: {
            title: "Special",
            options: {
              eels: {
                title: "Hovercraft without any eels",
              },
              noEels: {
                title: "Hovercraft full of eels (extra charge)",
              },
            },
          },
        },
      },
      color: {
        type: "choice",
        as: "buttons",
        title: "Vehicle Color",
        visible: ({ vehicle }) => !!vehicle,
        unset: "Don't Care",
        // TODO allow this to consume useFiles
        options: {
          black: {
            title: "Black",
          },
          neon: {
            title: "Neon Blue",
          },
          pink: {
            title: "Pink",
          },
        },
      },
      yupTest: {
        type: "text",
        title: "Validation Test",
        placeholder: "Demo of some custom yup validation",
        suggestions: [
          {
            hasNo: "goodbye",
            message: "Try saying goodbye!",
          },
          {
            has: "goodbye",
            message: "I don't know why you say goodbye. I say hello!",
          },
        ],
        validation: {
          yup: Yup.string()
            .label("This field")
            .oneOf(["hello", "goodbye"])
            .required(),
        },
      },
      category: {
        type: "choice",
        validation: { required: true },
        as: "buttons",
        title: "Category",
        options: {
          books: {
            title: "Books",
            options: {
              fiction: {
                title: "Fiction",
              },
              nonfiction: {
                title: "Non-Fiction",
                options: {
                  "self-help": {
                    title: "Self-Help",
                  },
                  "how-to": {
                    title: "How-To",
                  },
                  diy: {
                    title: "DIY",
                  },
                },
              },
            },
          },
          movies: {
            title: "Movies",
          },
          music: {
            title: "Music",
          },
        },
      },
      image: {
        type: "image",
        aspectRatio: 1,
      },
      images: {
        type: "images",
        limit: 2,
        totalFileSizeLimit: 1,
      },
    },
  },
});
