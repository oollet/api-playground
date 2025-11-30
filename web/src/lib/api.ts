/**
 * API Utility Functions
 * =====================
 * 
 * This file contains all the functions to communicate with our API.
 * Each function represents one API operation (GET, POST, PUT, PATCH, DELETE).
 * 
 * LEARNING POINTS:
 * - We use the 'fetch' function built into browsers to make HTTP requests
 * - Each request type (GET, POST, etc.) is called an "HTTP method"
 * - The API returns data in JSON format, which we convert to JavaScript objects
 */

// The URL of your API - change this to your own API!
export const API_BASE_URL = "https://api-playground-zita.onrender.com";

/**
 * What an "Object" looks like in our API
 * This is called a "Type" in TypeScript - it defines the shape of our data
 */
export type ApiObject = {
  id: string;           // Unique identifier (like a student ID)
  name: string;         // The name of the product
  data: Record<string, unknown> | null;  // Additional info (price, color, etc.)
  createdAt?: string;   // When it was created (optional)
  updatedAt?: string;   // When it was last updated (optional)
};

/**
 * The result of an API call
 * It can either succeed (with data) or fail (with an error message)
 */
export type ApiResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
};

/**
 * GET all objects from the API
 * 
 * HTTP Method: GET
 * What it does: Retrieves ALL items from the database
 * Real-world example: Loading your Instagram feed
 */
export async function getAllObjects(): Promise<ApiResult<ApiObject[]>> {
  try {
    // Make the GET request
    const response = await fetch(`${API_BASE_URL}/objects`);
    
    // Check if the request was successful
    if (!response.ok) {
      return {
        success: false,
        error: `Server returned error: ${response.status}`,
        statusCode: response.status,
      };
    }
    
    // Convert the JSON response to JavaScript objects
    const data = await response.json();
    
    return {
      success: true,
      data: data,
      statusCode: response.status,
    };
  } catch (error) {
    // Something went wrong (network error, etc.)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * GET a single object by its ID
 * 
 * HTTP Method: GET
 * What it does: Retrieves ONE specific item
 * Real-world example: Viewing a single product on Amazon
 */
export async function getObjectById(id: string): Promise<ApiResult<ApiObject>> {
  try {
    const response = await fetch(`${API_BASE_URL}/objects/${id}`);
    
    if (!response.ok) {
      return {
        success: false,
        error: `Object not found or error: ${response.status}`,
        statusCode: response.status,
      };
    }
    
    const data = await response.json();
    
    return {
      success: true,
      data: data,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * POST - Create a new object
 * 
 * HTTP Method: POST
 * What it does: Creates a NEW item in the database
 * Real-world example: Posting a new tweet or creating an account
 */
export async function createObject(
  name: string,
  data: Record<string, unknown> | null
): Promise<ApiResult<ApiObject>> {
  try {
    const response = await fetch(`${API_BASE_URL}/objects`, {
      method: "POST",  // Tell the server we want to CREATE
      headers: {
        "Content-Type": "application/json",  // We're sending JSON data
      },
      body: JSON.stringify({ name, data }),  // Convert our data to JSON string
    });
    
    if (!response.ok) {
      return {
        success: false,
        error: `Failed to create: ${response.status}`,
        statusCode: response.status,
      };
    }
    
    const createdObject = await response.json();
    
    return {
      success: true,
      data: createdObject,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * PUT - Update an object (replace entirely)
 * 
 * HTTP Method: PUT
 * What it does: REPLACES all data of an existing item
 * Real-world example: Editing your entire profile at once
 */
export async function updateObject(
  id: string,
  name: string,
  data: Record<string, unknown> | null
): Promise<ApiResult<ApiObject>> {
  try {
    const response = await fetch(`${API_BASE_URL}/objects/${id}`, {
      method: "PUT",  // Tell the server we want to REPLACE
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, data }),
    });
    
    if (!response.ok) {
      return {
        success: false,
        error: `Failed to update: ${response.status}`,
        statusCode: response.status,
      };
    }
    
    const updatedObject = await response.json();
    
    return {
      success: true,
      data: updatedObject,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * PATCH - Partially update an object
 * 
 * HTTP Method: PATCH
 * What it does: Updates ONLY the fields you specify
 * Real-world example: Changing just your profile picture
 */
export async function patchObject(
  id: string,
  updates: { name?: string; data?: Record<string, unknown> | null }
): Promise<ApiResult<ApiObject>> {
  try {
    const response = await fetch(`${API_BASE_URL}/objects/${id}`, {
      method: "PATCH",  // Tell the server we want to PARTIALLY update
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      return {
        success: false,
        error: `Failed to patch: ${response.status}`,
        statusCode: response.status,
      };
    }
    
    const patchedObject = await response.json();
    
    return {
      success: true,
      data: patchedObject,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * DELETE - Remove an object
 * 
 * HTTP Method: DELETE
 * What it does: Permanently removes an item
 * Real-world example: Deleting a post or closing an account
 */
export async function deleteObject(id: string): Promise<ApiResult<{ message: string }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/objects/${id}`, {
      method: "DELETE",  // Tell the server we want to REMOVE
    });
    
    if (!response.ok) {
      return {
        success: false,
        error: `Failed to delete: ${response.status}`,
        statusCode: response.status,
      };
    }
    
    const result = await response.json();
    
    return {
      success: true,
      data: result,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

