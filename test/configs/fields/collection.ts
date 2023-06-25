import { Fields } from "@/types";

// collection

/*
  name: string;
  title: string;
  limit?: number;
  showAtLeast?: number;
  fields: Fields;
  info?: string;
  infoLink?: string;
  addButton?: boolean | string;
*/

const basicFields: Fields = {
  text: {
    type: "text",
    title: "Basic Text",
  },
};

function getFancy(prefix: string): Fields {
  return {
    text: {
      type: "text",
      title: `${prefix} Title`,
    },
    choice: {
      type: "choice",
      title: `${prefix} Color`,
      as: "buttons",
      options: {
        blue: {
          title: `${prefix} Blue`,
        },
        red: {
          title: `${prefix} Red`,
        },
        green: {
          title: `${prefix} Green`,
        },
      },
    },
    image: {
      type: "image",
      title: `${prefix} Image`,
    },
    images: {
      type: "images",
      title: `${prefix} Images`,
      alt: true,
      validation: { required: true },
    },
  };
}

const collectionFieldTest: Fields = {
  infoCollection: {
    type: "info",
    title: "Collections allow you to group fields together and repeat them",
  },
  collectionBasic: {
    type: "collection",
    title: "Basic Collection",
    fields: basicFields,
  },
  collectionWithButton: {
    type: "collection",
    title: "Required Collection with button",
    fields: basicFields,
    addButton: "Add a new item",
    validation: { required: true },
  },
  collectionWithLimit: {
    type: "collection",
    title: "Collection with limit and min",
    fields: basicFields,
    validation: { max: 3, min: 2 },
  },
  collectionWithLimitButton: {
    type: "collection",
    title: "Collection with button, required limit and min",
    addButton: true,
    validation: { required: true, max: 3, min: 2 },
    fields: {
      text: {
        type: "text",
        title: "Basic Required",
        validation: { required: true },
      },
    },
  },
  infoSubCollection: {
    type: "info",
    title: "Collections can have their own sub-collections",
  },
  subCollection: {
    type: "collection",
    title: "Sub Collection Basic",
    fields: {
      text: {
        type: "text",
        title: "Basic Text",
      },
      subCollection: {
        type: "collection",
        title: "Sub Collection",
        fields: {
          text: {
            type: "text",
            title: "Sub Text",
          },
        },
      },
    },
  },
  subCollectionPopulated: {
    type: "collection",
    title: "Required Sub Collection with all fields",
    info: "Info here",
    infoLink: "https://example.com",
    addButton: "Add Parent",
    validation: { required: true },
    fields: {
      ...getFancy("Parent"),
      subCollection: {
        type: "collection",
        title: "Sub Collection",
        fields: getFancy("Sub"),
        addButton: "Add Sub",
        validation: { required: true },
      },
    },
  },
};

export default collectionFieldTest;
