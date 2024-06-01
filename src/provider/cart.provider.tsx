"use client";
import { createContext, use, useContext, useEffect, useReducer } from "react";

import axios from "../module/AxiosCustom/custome_Axios";
import { useAuthContext } from "./auth.provider";

const initialState = {
  totalOnline: 0,
  totalKiot: 0,
  onlineItems: [],
  kiotItems: [],
  onlineOrderItems: [],
  kiotOrderItems: [],
  selectedLocation: {}
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "onlineItems": {
      return {
        ...state,
        onlineItems: action.payload.onlineItems,
        totalOnline: action.payload.totalOnline,
      };
    }
    case "addItemsOnline": {
      const listId = state.onlineItems.map((item: any) => item.id);
      if (listId.includes(action.payload.id)) {
        return {
          ...state,
          onlineItems: state.onlineItems.map((item: any) =>
            item.id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item
          ),
        };
      } else {
        return {
          ...state,
          onlineItems: [...state.onlineItems, action.payload],
          totalOnline: state.totalOnline + 1,
        };
      }
    }
    case "removeItemsOnline": {
      const removeItem = state.onlineItems.filter(
        (item: any) => item.idOfProduct !== action.payload
      );
      return {
        ...state,
        onlineItems: removeItem,
        totalOnline: state.totalOnline - 1,
      };
    }

    case "kiotItems": {
      return {
        ...state,
        kiotItems: action.payload.kiotItems,
        totalKiot: action.payload.totalKiot,
      };
    }

    case "addItemsKiot": {
      const listId = state.kiotItems.map((item: any) => item.id);
      if (listId.includes(action.payload.id)) {
        return {
          ...state,
          kiotItems: state.kiotItems.map((item: any) =>
            item.id === action.payload.id
              ? { ...item, quantity: action.payload.quantity }
              : item
          ),
        };
      } else {
        return {
          ...state,
          kiotItems: [...state.kiotItems, action.payload],
          totalKiot: state.totalKiot + 1,
        };
      }
    }

    case "removeItemsKiot": {
      const removeItem = state.kiotItems.filter(
        (item: any) => item.idOfProduct !== action.payload
      );
      return {
        ...state,
        kiotItems: removeItem,
        totalKiot: state.totalKiot - 1,
      };
    }

    case "onlineOrderItems": {
      return {
        ...state,
        onlineOrderItems: action.payload,
      };
    }

    case "kiotOrderItems": {
      return {
        ...state,
        kiotOrderItems: action.payload,
      };
    }

    case "selectedLocation": {
      return {
        ...state,
        selectedLocation: action.payload,
      };
    }
  }
};

export const CartContext = createContext<any>({});

export const useCartContext = () => {
  return useContext<any>(CartContext);
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const initializer = () => {
    return {
      totalOnline: 0,
      totalKiot: 0,
      onlineItems: [],
      kiotItems: [],
      onlineOrderItems: [],
      kiotOrderItems: [],
      selectedLocation: {},
    };
  };

  const [state, dispatch] = useReducer(reducer, initialState, initializer);

  const authProvider = useAuthContext();
  const { isAuthenticated } = authProvider;

  const setOnlineItems = (onlineItems: any) => {
    dispatch({
      type: "onlineItems",
      payload: {
        onlineItems,
        totalOnline: onlineItems.length,
      },
    });
  };

  const addItemsOnline = (item: any) => {
    dispatch({
      type: "addItemsOnline",
      payload: item,
    });
  };

  const removeItemsOnline = (id: any) => {
    dispatch({
      type: "removeItemsOnline",
      payload: id,
    });
  };

  const setKiotItems = (kiotItems: any) => {
    dispatch({
      type: "kiotItems",
      payload: {
        kiotItems,
        totalKiot: kiotItems.length,
      },
    });
  };

  const addItemsKiot = (item: any) => {
    dispatch({
      type: "addItemsKiot",
      payload: item,
    });
  };

  const removeItemsKiot = (id: any) => {
    dispatch({
      type: "removeItemsKiot",
      payload: id,
    });
  };

  const setOnlineOrderItems = (onlineOrderItems: any) => { 
    dispatch({
      type: "onlineOrderItems",
      payload: onlineOrderItems,
    });
  }

  const setKiotOrderItems = (kiotOrderItems: any) => {
    dispatch({
      type: "kiotOrderItems",
      payload: kiotOrderItems,
    });
  }

  const setSelectedLocationCheckout = (location: any) => { 
    dispatch({
      type: "selectedLocation",
      payload: location,
    });
  
  }

  useEffect(() => {
    async function fetchData() {
      if (isAuthenticated) {
        const onlineItems = await axios
          .post("product-in-carts/getOnline")
          .then((res) => res.data)
          .catch((e) => console.log(e));
        setOnlineItems(onlineItems);

        const kiotItems = await axios
          .post("product-in-carts/getKiot")
          .then((res) => res.data)
          .catch((e) => console.log(e));

        setKiotItems(kiotItems);
      }
    }

    fetchData();
  }, [isAuthenticated]);

  const value = {
    ...state,
    addItemsOnline,
    removeItemsOnline,
    addItemsKiot,
    removeItemsKiot,
    setOnlineOrderItems,
    setKiotOrderItems,
    setSelectedLocationCheckout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
