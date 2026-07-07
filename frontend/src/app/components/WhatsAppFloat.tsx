import { MessageCircle, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useState } from "react";

export default function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppClick = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919876543200?text=${encodedMessage}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <Card className="mb-4 w-72 shadow-lg border-0 animate-in slide-in-from-bottom-2">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">FreshFarm Support</h4>
                  <p className="text-xs text-green-600">Usually replies in minutes</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 h-auto"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-sm text-gray-600 mb-3">
              Hi! 👋 How can we help you today?
            </p>

            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-left justify-start text-xs h-auto py-2"
                onClick={() => handleWhatsAppClick("Hi, I need help with placing an order.")}
              >
                🛒 Help with ordering
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-left justify-start text-xs h-auto py-2"
                onClick={() => handleWhatsAppClick("Hi, I want to join as a farmer.")}
              >
                🌾 Join as Farmer
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-left justify-start text-xs h-auto py-2"
                onClick={() => handleWhatsAppClick("Hi, I need support with my account.")}
              >
                👤 Account Support
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-left justify-start text-xs h-auto py-2"
                onClick={() => handleWhatsAppClick("Hi, I want to place a bulk order.")}
              >
                📦 Bulk Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 animate-pulse"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
}