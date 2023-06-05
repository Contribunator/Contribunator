import genericConfig from "@/contributions/generic/config";
import getImageType from "@/lib/getImageType";

export default genericConfig({
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
            text: "Car",
          },
          truck: {
            text: "Truck",
          },
          bike: {
            text: "Bike",
          },
          hovercraft: {
            text: "Hovercraft",
          },
        },
      },
      color: {
        type: "choice",
        component: "buttons",
        title: "Vehicle Color",
        visible: ({ vehicle }) => !!vehicle,
        unset: "Don't Care",
        // TODO allow this to consume useFiles
        options: {
          black: {
            text: "Black",
          },
          neon: {
            text: "Neon Blue",
          },
          pink: {
            text: "Pink",
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
