/**
 * API Playground - Interactive Web App
 * =====================================
 * 
 * This is the main page of our web app. It lets you:
 * - See all objects in the API (GET)
 * - Create new objects (POST)
 * - Update objects (PUT/PATCH)
 * - Delete objects (DELETE)
 * 
 * LEARNING POINTS:
 * - "use client" means this runs in the browser (not on the server)
 * - useState is how React remembers things between renders
 * - useEffect runs code when the page loads
 * - async/await is how we wait for API responses
 */

"use client";

import { useState, useEffect } from "react";
import {
  getAllObjects,
  getObjectById,
  createObject,
  updateObject,
  patchObject,
  deleteObject,
  API_BASE_URL,
  type ApiObject,
} from "@/lib/api";

// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

/**
 * Color codes for different HTTP methods
 * These help visually distinguish different types of operations
 */
const methodColors: Record<string, string> = {
  GET: "bg-emerald-500",      // Green = Read (safe, doesn't change anything)
  POST: "bg-blue-500",        // Blue = Create (adds something new)
  PUT: "bg-amber-500",        // Orange = Update (replaces data)
  PATCH: "bg-purple-500",     // Purple = Partial update
  DELETE: "bg-red-500",       // Red = Delete (destructive action)
};

/**
 * Main Page Component
 * This is the heart of our application
 */
export default function ApiPlayground() {
  // ============================================
  // STATE VARIABLES
  // These are like "memory boxes" that React uses to remember data
  // ============================================
  
  // The list of all objects from the API
  const [objects, setObjects] = useState<ApiObject[]>([]);
  
  // Loading state - true when we're waiting for API response
  const [loading, setLoading] = useState(false);
  
  // The last API response (for showing in the "Response" panel)
  const [lastResponse, setLastResponse] = useState<string>("");
  
  // The last HTTP method used (GET, POST, etc.)
  const [lastMethod, setLastMethod] = useState<string>("");
  
  // The last URL that was called
  const [lastUrl, setLastUrl] = useState<string>("");
  
  // Status code from the last request
  const [lastStatus, setLastStatus] = useState<number | null>(null);
  
  // Form inputs for creating/updating objects
  const [formName, setFormName] = useState("");
  const [formData, setFormData] = useState("");
  const [formId, setFormId] = useState("");
  
  // Error message (if any)
  const [error, setError] = useState<string | null>(null);
  
  // Success message (if any)
  const [success, setSuccess] = useState<string | null>(null);
  
  // JSON validation error (for the data input field)
  const [jsonError, setJsonError] = useState<string | null>(null);

  // ============================================
  // LOAD DATA ON PAGE LOAD
  // useEffect runs when the component first appears
  // ============================================
  useEffect(() => {
    handleGetAll();
  }, []); // Empty array means "run once when page loads"

  // ============================================
  // JSON VALIDATION FUNCTION
  // Validates JSON input in real-time
  // ============================================
  
  /**
   * Validates JSON string
   * Returns null if valid, error message if invalid
   */
  function validateJson(jsonString: string): string | null {
    // If empty, it's valid (optional field)
    if (!jsonString.trim()) {
      return null;
    }
    
    try {
      // Try to parse the JSON
      JSON.parse(jsonString);
      return null; // Valid JSON!
    } catch (error) {
      // Invalid JSON - return helpful error message
      if (error instanceof SyntaxError) {
        return `Invalid JSON: ${error.message}`;
      }
      return "Invalid JSON format";
    }
  }
  
  /**
   * Handles JSON input change with validation
   */
  function handleJsonChange(value: string) {
    setFormData(value);
    const validationError = validateJson(value);
    setJsonError(validationError);
  }

  // ============================================
  // API HANDLER FUNCTIONS
  // These functions call the API and update the UI
  // ============================================

  /**
   * GET all objects
   */
  async function handleGetAll() {
    setLoading(true);
    setError(null);
    setLastMethod("GET");
    setLastUrl(`${API_BASE_URL}/objects`);
    
    const result = await getAllObjects();
    
    setLastStatus(result.statusCode ?? null);
    setLastResponse(JSON.stringify(result.data ?? result.error, null, 2));
    
    if (result.success && result.data) {
      setObjects(result.data);
      setSuccess(`Found ${result.data.length} objects!`);
    } else {
      setError(result.error ?? "Failed to fetch objects");
    }
    
    setLoading(false);
    setTimeout(() => setSuccess(null), 3000);
  }

  /**
   * GET a single object by ID
   */
  async function handleGetById() {
    if (!formId.trim()) {
      setError("Please enter an ID");
      return;
    }
    
    setLoading(true);
    setError(null);
    setLastMethod("GET");
    setLastUrl(`${API_BASE_URL}/objects/${formId}`);
    
    const result = await getObjectById(formId);
    
    setLastStatus(result.statusCode ?? null);
    setLastResponse(JSON.stringify(result.data ?? result.error, null, 2));
    
    if (result.success) {
      setSuccess(`Found object with ID: ${formId}`);
    } else {
      setError(result.error ?? "Object not found");
    }
    
    setLoading(false);
    setTimeout(() => setSuccess(null), 3000);
  }

  /**
   * POST - Create a new object
   */
  async function handleCreate() {
    if (!formName.trim()) {
      setError("Please enter a name for the object");
      return;
    }
    
    // Check for JSON validation errors
    if (jsonError) {
      setError("Please fix JSON errors before submitting");
      return;
    }
    
    setLoading(true);
    setError(null);
    setLastMethod("POST");
    setLastUrl(`${API_BASE_URL}/objects`);
    
    // Parse the data field (if provided)
    let parsedData = null;
    if (formData.trim()) {
      try {
        parsedData = JSON.parse(formData);
      } catch {
        setError("Invalid JSON in data field. Example: {\"price\": 99.99}");
        setLoading(false);
        return;
      }
    }
    
    const result = await createObject(formName, parsedData);
    
    setLastStatus(result.statusCode ?? null);
    setLastResponse(JSON.stringify(result.data ?? result.error, null, 2));
    
    if (result.success) {
      setSuccess(`Created new object with ID: ${result.data?.id}`);
      handleGetAll(); // Refresh the list
      setFormName("");
      setFormData("");
      setJsonError(null); // Clear JSON error when form is reset
    } else {
      setError(result.error ?? "Failed to create object");
    }
    
    setLoading(false);
  }

  /**
   * PUT - Update an entire object
   */
  async function handleUpdate() {
    if (!formId.trim() || !formName.trim()) {
      setError("Please enter both ID and name");
      return;
    }
    
    // Check for JSON validation errors
    if (jsonError) {
      setError("Please fix JSON errors before submitting");
      return;
    }
    
    setLoading(true);
    setError(null);
    setLastMethod("PUT");
    setLastUrl(`${API_BASE_URL}/objects/${formId}`);
    
    let parsedData = null;
    if (formData.trim()) {
      try {
        parsedData = JSON.parse(formData);
      } catch {
        setError("Invalid JSON in data field");
        setLoading(false);
        return;
      }
    }
    
    const result = await updateObject(formId, formName, parsedData);
    
    setLastStatus(result.statusCode ?? null);
    setLastResponse(JSON.stringify(result.data ?? result.error, null, 2));
    
    if (result.success) {
      setSuccess(`Updated object with ID: ${formId}`);
      handleGetAll();
    } else {
      setError(result.error ?? "Failed to update object");
    }
    
    setLoading(false);
  }

  /**
   * PATCH - Partially update an object
   */
  async function handlePatch() {
    if (!formId.trim()) {
      setError("Please enter an ID");
      return;
    }
    
    // Check for JSON validation errors (only if data is provided)
    if (formData.trim() && jsonError) {
      setError("Please fix JSON errors before submitting");
      return;
    }
    
    setLoading(true);
    setError(null);
    setLastMethod("PATCH");
    setLastUrl(`${API_BASE_URL}/objects/${formId}`);
    
    const updates: { name?: string; data?: Record<string, unknown> | null } = {};
    
    if (formName.trim()) {
      updates.name = formName;
    }
    
    if (formData.trim()) {
      try {
        updates.data = JSON.parse(formData);
      } catch {
        setError("Invalid JSON in data field");
        setLoading(false);
        return;
      }
    }
    
    if (Object.keys(updates).length === 0) {
      setError("Please provide at least a name or data to update");
      setLoading(false);
      return;
    }
    
    const result = await patchObject(formId, updates);
    
    setLastStatus(result.statusCode ?? null);
    setLastResponse(JSON.stringify(result.data ?? result.error, null, 2));
    
    if (result.success) {
      setSuccess(`Patched object with ID: ${formId}`);
      handleGetAll();
    } else {
      setError(result.error ?? "Failed to patch object");
    }
    
    setLoading(false);
  }

  /**
   * DELETE - Remove an object
   */
  async function handleDelete(id: string) {
    setLoading(true);
    setError(null);
    setLastMethod("DELETE");
    setLastUrl(`${API_BASE_URL}/objects/${id}`);
    
    const result = await deleteObject(id);
    
    setLastStatus(result.statusCode ?? null);
    setLastResponse(JSON.stringify(result.data ?? result.error, null, 2));
    
    if (result.success) {
      setSuccess(`Deleted object with ID: ${id}`);
      handleGetAll();
    } else {
      setError(result.error ?? "Failed to delete object");
    }
    
    setLoading(false);
  }

  /**
   * Load an object into the form for editing
   */
  function loadObjectForEdit(obj: ApiObject) {
    setFormId(obj.id);
    setFormName(obj.name);
    setFormData(obj.data ? JSON.stringify(obj.data, null, 2) : "");
  }

  // ============================================
  // RENDER THE UI
  // Everything below creates what you see on screen
  // ============================================
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🚀 API Playground
              </h1>
              <p className="text-sm text-muted-foreground">
                Learn REST APIs by doing!
              </p>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {API_BASE_URL}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Alerts for success/error messages */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-950">
            <AlertTitle className="text-green-700 dark:text-green-300">Success!</AlertTitle>
            <AlertDescription className="text-green-600 dark:text-green-400">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT PANEL: API Operations */}
          <div className="lg:col-span-2 space-y-6">
            {/* HTTP Methods Legend */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">HTTP Methods</CardTitle>
                <CardDescription>
                  Each color represents a different type of API operation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(methodColors).map(([method, color]) => (
                    <Badge key={method} className={`${color} text-white`}>
                      {method}
                    </Badge>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-muted-foreground">
                  <div>GET = Read</div>
                  <div>POST = Create</div>
                  <div>PUT = Replace</div>
                  <div>PATCH = Update</div>
                  <div>DELETE = Remove</div>
                </div>
              </CardContent>
            </Card>

            {/* API Operations Tabs */}
            <Card>
              <CardHeader>
                <CardTitle>Try API Operations</CardTitle>
                <CardDescription>
                  Select an operation and fill in the required fields
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="get" className="w-full">
                  <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="get" className="text-xs">
                      <Badge className={`${methodColors.GET} text-white mr-1`}>GET</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="post" className="text-xs">
                      <Badge className={`${methodColors.POST} text-white mr-1`}>POST</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="put" className="text-xs">
                      <Badge className={`${methodColors.PUT} text-white mr-1`}>PUT</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="patch" className="text-xs">
                      <Badge className={`${methodColors.PATCH} text-white mr-1`}>PATCH</Badge>
                    </TabsTrigger>
                    <TabsTrigger value="delete" className="text-xs">
                      <Badge className={`${methodColors.DELETE} text-white mr-1`}>DEL</Badge>
                    </TabsTrigger>
                  </TabsList>

                  {/* GET Tab */}
                  <TabsContent value="get" className="space-y-4">
                    <div className="grid gap-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={handleGetAll}
                          disabled={loading}
                          className="bg-emerald-500 hover:bg-emerald-600"
                        >
                          {loading ? "Loading..." : "GET All Objects"}
                        </Button>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <Label htmlFor="getId">Get by ID</Label>
                        <div className="flex gap-2">
                          <Input
                            id="getId"
                            placeholder="Enter object ID (e.g., 1)"
                            value={formId}
                            onChange={(e) => setFormId(e.target.value)}
                          />
                          <Button
                            onClick={handleGetById}
                            disabled={loading}
                            variant="outline"
                          >
                            GET
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* POST Tab */}
                  <TabsContent value="post" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="postName">Name *</Label>
                        <Input
                          id="postName"
                          placeholder="e.g., My Awesome Product"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postData">Data (JSON, optional)</Label>
                        <Textarea
                          id="postData"
                          placeholder={'{"price": 99.99, "color": "blue"}'}
                          value={formData}
                          onChange={(e) => handleJsonChange(e.target.value)}
                          className={`font-mono text-sm ${
                            jsonError ? "border-red-500 focus-visible:ring-red-500" : ""
                          }`}
                        />
                        {jsonError && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <span>⚠️</span>
                            {jsonError}
                          </p>
                        )}
                        {!jsonError && formData.trim() && (
                          <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                            <span>✓</span>
                            Valid JSON
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={handleCreate}
                        disabled={loading || (formData.trim() && jsonError !== null)}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        {loading ? "Creating..." : "POST - Create Object"}
                      </Button>
                    </div>
                  </TabsContent>

                  {/* PUT Tab */}
                  <TabsContent value="put" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="putId">Object ID *</Label>
                        <Input
                          id="putId"
                          placeholder="ID of object to update"
                          value={formId}
                          onChange={(e) => setFormId(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="putName">New Name *</Label>
                        <Input
                          id="putName"
                          placeholder="The new name"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="putData">New Data (JSON, optional)</Label>
                        <Textarea
                          id="putData"
                          placeholder={'{"price": 149.99}'}
                          value={formData}
                          onChange={(e) => handleJsonChange(e.target.value)}
                          className={`font-mono text-sm ${
                            jsonError ? "border-red-500 focus-visible:ring-red-500" : ""
                          }`}
                        />
                        {jsonError && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <span>⚠️</span>
                            {jsonError}
                          </p>
                        )}
                        {!jsonError && formData.trim() && (
                          <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                            <span>✓</span>
                            Valid JSON
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={handleUpdate}
                        disabled={loading || (formData.trim() && jsonError !== null)}
                        className="bg-amber-500 hover:bg-amber-600"
                      >
                        {loading ? "Updating..." : "PUT - Replace Object"}
                      </Button>
                    </div>
                  </TabsContent>

                  {/* PATCH Tab */}
                  <TabsContent value="patch" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="patchId">Object ID *</Label>
                        <Input
                          id="patchId"
                          placeholder="ID of object to patch"
                          value={formId}
                          onChange={(e) => setFormId(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patchName">Name (leave empty to keep current)</Label>
                        <Input
                          id="patchName"
                          placeholder="Only fill if changing name"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patchData">Data (leave empty to keep current)</Label>
                        <Textarea
                          id="patchData"
                          placeholder={'{"price": 79.99}'}
                          value={formData}
                          onChange={(e) => handleJsonChange(e.target.value)}
                          className={`font-mono text-sm ${
                            jsonError ? "border-red-500 focus-visible:ring-red-500" : ""
                          }`}
                        />
                        {jsonError && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <span>⚠️</span>
                            {jsonError}
                          </p>
                        )}
                        {!jsonError && formData.trim() && (
                          <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                            <span>✓</span>
                            Valid JSON
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={handlePatch}
                        disabled={loading || (formData.trim() && jsonError !== null)}
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        {loading ? "Patching..." : "PATCH - Partial Update"}
                      </Button>
                    </div>
                  </TabsContent>

                  {/* DELETE Tab */}
                  <TabsContent value="delete" className="space-y-4">
                    <div className="space-y-4">
                      <Alert variant="destructive">
                        <AlertTitle>⚠️ Danger Zone</AlertTitle>
                        <AlertDescription>
                          Delete operations cannot be undone! Use with caution.
                        </AlertDescription>
                      </Alert>
                      <div className="space-y-2">
                        <Label htmlFor="deleteId">Object ID to Delete</Label>
                        <div className="flex gap-2">
                          <Input
                            id="deleteId"
                            placeholder="Enter ID to delete"
                            value={formId}
                            onChange={(e) => setFormId(e.target.value)}
                          />
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="destructive" disabled={!formId.trim()}>
                                DELETE
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete object with ID: {formId}?
                                  This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(formId)}
                                  >
                                    Yes, Delete
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Objects Table */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Objects in Database</CardTitle>
                  <CardDescription>
                    {objects.length} objects found
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGetAll}
                  disabled={loading}
                >
                  🔄 Refresh
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="w-[200px]">Data</TableHead>
                        <TableHead className="w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {objects.map((obj) => (
                        <TableRow key={obj.id}>
                          <TableCell className="font-mono text-xs">
                            {obj.id.length > 8 ? obj.id.slice(0, 8) + "..." : obj.id}
                          </TableCell>
                          <TableCell className="font-medium">{obj.name}</TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                            {obj.data ? JSON.stringify(obj.data) : "—"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => loadObjectForEdit(obj)}
                                title="Edit"
                              >
                                ✏️
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    title="Delete"
                                  >
                                    🗑️
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Delete {obj.name}?</DialogTitle>
                                    <DialogDescription>
                                      This will permanently remove this object.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleDelete(obj.id)}
                                      >
                                        Delete
                                      </Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT PANEL: Response Viewer */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  API Response
                  {lastStatus && (
                    <Badge
                      variant={lastStatus >= 200 && lastStatus < 300 ? "default" : "destructive"}
                    >
                      {lastStatus}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  See what the API returns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {lastMethod && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={`${methodColors[lastMethod]} text-white`}>
                        {lastMethod}
                      </Badge>
                      <code className="text-xs text-muted-foreground break-all">
                        {lastUrl}
                      </code>
                    </div>
                  </div>
                )}
                <Separator />
                <div>
                  <Label className="text-xs text-muted-foreground">Response Body</Label>
                  <ScrollArea className="h-[400px] mt-2">
                    <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-x-auto">
                      {lastResponse || "Make an API call to see the response here"}
                    </pre>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Built with ❤️ for learning | 
            <a
              href="https://github.com/oollet/api-playground"
              className="ml-1 underline hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
