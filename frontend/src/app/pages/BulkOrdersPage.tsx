import { useState } from "react";
import { Plus, Trash2, MessageCircle, Calculator, Send } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import PageNavigation from "../components/PageNavigation";

interface BulkOrderItem {
  id: number;
  product: string;
  category: string;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  specifications: string;
}

const productCategories = [
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" },
  { value: "grains", label: "Grains & Cereals" },
  { value: "dairy", label: "Dairy Products" },
  { value: "herbs", label: "Herbs & Spices" },
  { value: "organic", label: "Organic Products" }
];

const estimatedPrices: Record<string, number> = {
  "tomatoes": 40,
  "onions": 30,
  "potatoes": 25,
  "mangoes": 80,
  "apples": 120,
  "rice": 60,
  "wheat": 35,
  "milk": 55,
  "paneer": 300
};

export default function BulkOrdersPage() {
  const [orderItems, setOrderItems] = useState<BulkOrderItem[]>([
    { id: 1, product: "", category: "", quantity: 0, unit: "kg", estimatedPrice: 0, specifications: "" }
  ]);
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    businessType: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    deliveryDate: "",
    specialRequirements: ""
  });

  const addOrderItem = () => {
    const newItem: BulkOrderItem = {
      id: Date.now(),
      product: "",
      category: "",
      quantity: 0,
      unit: "kg",
      estimatedPrice: 0,
      specifications: ""
    };
    setOrderItems([...orderItems, newItem]);
  };

  const removeOrderItem = (id: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter(item => item.id !== id));
    }
  };

  const updateOrderItem = (id: number, field: keyof BulkOrderItem, value: any) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Auto-calculate estimated price when product or quantity changes
        if (field === 'product' || field === 'quantity') {
          const productKey = updatedItem.product.toLowerCase();
          const basePrice = estimatedPrices[productKey] || 50;
          updatedItem.estimatedPrice = basePrice * updatedItem.quantity;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const getTotalEstimatedValue = () => {
    return orderItems.reduce((total, item) => total + item.estimatedPrice, 0);
  };

  const handleSubmitOrder = () => {
    const orderSummary = orderItems.map(item => 
      `${item.quantity}${item.unit} ${item.product} (${item.category}) - ₹${item.estimatedPrice}`
    ).join('\n');
    
    const message = encodeURIComponent(`
Bulk Order Request from FreshFarm:

Business: ${businessInfo.businessName}
Contact: ${businessInfo.contactPerson}
Phone: ${businessInfo.phone}
Type: ${businessInfo.businessType}

Required Delivery: ${businessInfo.deliveryDate}

Order Details:
${orderSummary}

Total Estimated Value: ₹${getTotalEstimatedValue()}

Special Requirements: ${businessInfo.specialRequirements}

Address: ${businessInfo.address}
    `.trim());
    
    window.open(`https://wa.me/919876543200?text=${message}`, '_blank');
  };

  return (
    <>
      <PageNavigation currentPage="bulk-orders" title="Bulk Orders" />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Orders</h1>
          <p className="text-gray-600">Place large quantity orders for restaurants, hotels, or businesses</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2">🏢</span>
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                  <Input
                    placeholder="Enter business name"
                    value={businessInfo.businessName}
                    onChange={(e) => setBusinessInfo({...businessInfo, businessName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
                  <Select 
                    value={businessInfo.businessType} 
                    onValueChange={(value) => setBusinessInfo({...businessInfo, businessType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="catering">Catering Service</SelectItem>
                      <SelectItem value="retail">Retail Store</SelectItem>
                      <SelectItem value="processing">Food Processing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person *</label>
                  <Input
                    placeholder="Enter contact person name"
                    value={businessInfo.contactPerson}
                    onChange={(e) => setBusinessInfo({...businessInfo, contactPerson: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <Input
                    placeholder="+91-XXXXXXXXXX"
                    value={businessInfo.phone}
                    onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={businessInfo.email}
                    onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Required Delivery Date *</label>
                  <Input
                    type="date"
                    value={businessInfo.deliveryDate}
                    onChange={(e) => setBusinessInfo({...businessInfo, deliveryDate: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address *</label>
                <Textarea
                  placeholder="Enter complete delivery address"
                  value={businessInfo.address}
                  onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <span className="mr-2">📦</span>
                  Order Items
                </span>
                <Button onClick={addOrderItem} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderItems.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Item #{index + 1}</h4>
                    {orderItems.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOrderItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <Select 
                        value={item.category} 
                        onValueChange={(value) => updateOrderItem(item.id, 'category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories.map(cat => (
                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                      <Input
                        placeholder="e.g., Tomatoes, Basmati Rice"
                        value={item.product}
                        onChange={(e) => updateOrderItem(item.id, 'product', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={item.quantity || ''}
                        onChange={(e) => updateOrderItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                      <Select 
                        value={item.unit} 
                        onValueChange={(value) => updateOrderItem(item.id, 'unit', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilograms (kg)</SelectItem>
                          <SelectItem value="tons">Tons</SelectItem>
                          <SelectItem value="liters">Liters</SelectItem>
                          <SelectItem value="pieces">Pieces</SelectItem>
                          <SelectItem value="boxes">Boxes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
                    <Textarea
                      placeholder="Quality requirements, size, grade, etc."
                      value={item.specifications}
                      onChange={(e) => updateOrderItem(item.id, 'specifications', e.target.value)}
                    />
                  </div>
                  
                  {item.estimatedPrice > 0 && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-700">Estimated Price:</span>
                        <span className="font-semibold text-green-800">₹{item.estimatedPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Special Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2">📝</span>
                Special Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any special packaging, delivery instructions, or other requirements..."
                value={businessInfo.specialRequirements}
                onChange={(e) => setBusinessInfo({...businessInfo, specialRequirements: e.target.value})}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="w-5 h-5 mr-2" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderItems.filter(item => item.product && item.quantity > 0).map((item, index) => (
                <div key={item.id} className="flex justify-between items-start text-sm">
                  <div className="flex-1">
                    <div className="font-medium">{item.product}</div>
                    <div className="text-gray-500">{item.quantity}{item.unit}</div>
                  </div>
                  <div className="font-medium">₹{item.estimatedPrice.toLocaleString()}</div>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between items-center font-semibold">
                <span>Total Estimated Value:</span>
                <span className="text-green-600">₹{getTotalEstimatedValue().toLocaleString()}</span>
              </div>
              
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <strong>Note:</strong> This is an estimated value. Final prices will be confirmed by farmers based on quality, quantity, and market conditions.
              </div>
              
              <Button 
                onClick={handleSubmitOrder}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={!businessInfo.businessName || !businessInfo.contactPerson || orderItems.filter(item => item.product && item.quantity > 0).length === 0}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Bulk Order Request
              </Button>
              
              <div className="flex items-center justify-center text-sm text-gray-500">
                <MessageCircle className="w-4 h-4 mr-1" />
                Request will be sent via WhatsApp
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Bulk Order Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <Badge className="bg-green-100 text-green-700 mt-1">💰</Badge>
                <div className="text-sm">
                  <div className="font-medium">Better Prices</div>
                  <div className="text-gray-600">Get wholesale rates for large quantities</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Badge className="bg-green-100 text-green-700 mt-1">🚚</Badge>
                <div className="text-sm">
                  <div className="font-medium">Free Delivery</div>
                  <div className="text-gray-600">No delivery charges for bulk orders</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Badge className="bg-green-100 text-green-700 mt-1">⭐</Badge>
                <div className="text-sm">
                  <div className="font-medium">Quality Assured</div>
                  <div className="text-gray-600">Premium quality products guaranteed</div>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Badge className="bg-green-100 text-green-700 mt-1">📞</Badge>
                <div className="text-sm">
                  <div className="font-medium">Direct Contact</div>
                  <div className="text-gray-600">Communicate directly with farmers</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </>
  );
}