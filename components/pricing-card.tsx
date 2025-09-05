import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

interface PricingCardProps {
  name: string;
  price: number;
  period: string;
  features: string[];
  isPopular?: boolean;
  onPurchase?: () => void;
  isLoading?: boolean;
}

export function PricingCard({
  name,
  price,
  period,
  features,
  isPopular = false,
  onPurchase,
  isLoading = false,
}: PricingCardProps) {
  return (
    <Card className={`w-full max-w-sm ${isPopular ? 'border-2 border-primary' : ''}`}>
      {isPopular && (
        <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{name}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">₹{price}</span>
          <span className="text-muted-foreground">/{period}</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg
                className="h-5 w-5 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={onPurchase}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            "Purchase Subscription"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
