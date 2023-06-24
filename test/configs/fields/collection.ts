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
    },
  };
}

const collectionFieldTest: Fields = {
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
    validation: {
      required: true,
    },
  },
  collectionWithLimit: {
    type: "collection",
    title: "Collection with limit and min",
    fields: basicFields,
    // TODO: allows blank after unsetting
    validation: { max: 3, min: 2 },
    limit: 3,
  },
  collectionWithLimitButton: {
    type: "collection",
    title: "Collection with button, limit and min",
    fields: basicFields,
    addButton: "Add a new item",
    // TODO: allows blank after unsetting
    validation: { max: 3, min: 2 },
    limit: 3,
  },
  collectionAtLeast: {
    type: "collection",
    title: "Collection pre-showing items",
    fields: basicFields,
    showAtLeast: 3,
  },
  collectionAtLeastButton: {
    type: "collection",
    title: "Collection with button showing items",
    fields: basicFields,
    showAtLeast: 3,
    addButton: true,
  },
  collectionWithInfo: {
    type: "collection",
    title: "Collection with info",
    fields: basicFields,
    info: "Info here",
    infoLink: "https://example.com",
  },
  subCollection: {
    type: "collection",
    title: "Sub Collection",
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
    validation: {
      min: 2,
      required: true,
    },
    addButton: "Add Parent",
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
