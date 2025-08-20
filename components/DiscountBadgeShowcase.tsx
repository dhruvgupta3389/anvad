import { DiscountBadge } from "@/components/ui/discount-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DiscountBadgeShowcase = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 bg-gradient-to-br from-background to-muted/20">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#7d3600] to-[#b84d00] bg-clip-text text-transparent mb-4">
          Discount Badge Collection
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A comprehensive collection of modern, animated discount badges designed for e-commerce excellence
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <Badge variant="secondary">11 Variants</Badge>
          <Badge variant="secondary">8 Colors</Badge>
          <Badge variant="secondary">3 Sizes</Badge>
          <Badge variant="secondary">Animations</Badge>
        </div>
      </div>

      {/* Featured Examples */}
      <Card className="border-2 border-primary/20 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#7d3600] flex items-center justify-center gap-2">
            ✨ Featured Examples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* High Impact Sale */}
            <div className="relative bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <DiscountBadge
                variant="tab"
                badgeColor="hot"
                size="lg"
                position="top-left"
                intensity="high"
                className="animate-pulse"
              >
                50% OFF
              </DiscountBadge>
              <img
                src="https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=250&fit=crop&crop=center"
                alt="Premium Product"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6">
                <h3 className="font-bold text-[#7d3600] text-lg mb-2">Premium A2 Ghee</h3>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-[#7d3600]">₹499</span>
                  <span className="text-lg text-gray-500 line-through">₹999</span>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">Save ₹500</span>
                </div>
              </div>
            </div>

            {/* New Product */}
            <div className="relative bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <DiscountBadge
                variant="corner"
                badgeColor="new"
                size="md"
                position="top-right"
                intensity="medium"
              >
                NEW
              </DiscountBadge>
              <img
                src="https://images.unsplash.com/photo-1587049016823-c80767480df6?w=400&h=250&fit=crop&crop=center"
                alt="New Product"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6">
                <h3 className="font-bold text-[#7d3600] text-lg mb-2">Pure Honey</h3>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-[#7d3600]">₹299</span>
                  <span className="text-sm bg-[#7d3600]/10 text-[#7d3600] px-2 py-1 rounded-full">Just Launched</span>
                </div>
              </div>
            </div>

            {/* Limited Edition */}
            <div className="relative bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <DiscountBadge
                variant="ribbon"
                badgeColor="limited"
                size="md"
                position="top-left"
                intensity="high"
              >
                LIMITED
              </DiscountBadge>
              <img
                src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=250&fit=crop&crop=center"
                alt="Limited Product"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-6">
                <h3 className="font-bold text-[#7d3600] text-lg mb-2">Organic Oil</h3>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-[#7d3600]">₹399</span>
                  <span className="text-sm bg-[#b84d00]/10 text-[#b84d00] px-2 py-1 rounded-full">Only 50 Left</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badge Variants */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-[#7d3600] flex items-center gap-2">
            🎨 Style Variants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { variant: "simple", name: "Simple" },
              { variant: "tab", name: "Tab" },
              { variant: "ribbon", name: "Ribbon" },
              { variant: "corner", name: "Corner" },
              { variant: "flag", name: "Flag" },
              { variant: "folded", name: "Folded" }
            ].map(({ variant, name }) => (
              <div key={variant} className="text-center space-y-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <DiscountBadge variant={variant as any} badgeColor="sale" size="md">
                  25% OFF
                </DiscountBadge>
                <p className="text-sm font-medium text-gray-700">{name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-[#7d3600] flex items-center gap-2">
            🎨 Color Palette
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { color: "primary", name: "Primary", text: "BRAND" },
              { color: "secondary", name: "Secondary", text: "QUALITY" },
              { color: "accent", name: "Accent", text: "FEATURED" },
              { color: "sale", name: "Sale", text: "50% OFF" },
              { color: "hot", name: "Hot", text: "HOT DEAL" },
              { color: "new", name: "New", text: "NEW" },
              { color: "limited", name: "Limited", text: "LIMITED" },
              { color: "subtle", name: "Subtle", text: "5% OFF" }
            ].map(({ color, name, text }) => (
              <div key={color} className="text-center space-y-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <DiscountBadge variant="tab" badgeColor={color as any} size="sm">
                  {text}
                </DiscountBadge>
                <p className="text-xs font-medium text-gray-600">{name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Size Variations */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-[#7d3600] flex items-center gap-2">
            📏 Size Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-center gap-8">
            <div className="text-center space-y-3">
              <DiscountBadge variant="tab" badgeColor="sale" size="sm">
                15% OFF
              </DiscountBadge>
              <p className="text-sm font-medium text-gray-700">Small</p>
              <p className="text-xs text-gray-500">Subtle discounts</p>
            </div>
            <div className="text-center space-y-3">
              <DiscountBadge variant="tab" badgeColor="sale" size="md">
                25% OFF
              </DiscountBadge>
              <p className="text-sm font-medium text-gray-700">Medium</p>
              <p className="text-xs text-gray-500">Standard size</p>
            </div>
            <div className="text-center space-y-3">
              <DiscountBadge variant="tab" badgeColor="sale" size="lg">
                35% OFF
              </DiscountBadge>
              <p className="text-sm font-medium text-gray-700">Large</p>
              <p className="text-xs text-gray-500">High impact</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Intensity Levels */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-[#7d3600] flex items-center gap-2">
            ⚡ Intensity Levels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-12">
            <div className="text-center space-y-3">
              <DiscountBadge variant="tab" badgeColor="sale" intensity="low" size="md">
                10% OFF
              </DiscountBadge>
              <p className="text-sm font-medium text-gray-700">Low</p>
              <p className="text-xs text-gray-500">Subtle shadow</p>
            </div>
            <div className="text-center space-y-3">
              <DiscountBadge variant="tab" badgeColor="sale" intensity="medium" size="md">
                25% OFF
              </DiscountBadge>
              <p className="text-sm font-medium text-gray-700">Medium</p>
              <p className="text-xs text-gray-500">Standard effect</p>
            </div>
            <div className="text-center space-y-3">
              <DiscountBadge variant="tab" badgeColor="sale" intensity="high" size="md">
                50% OFF
              </DiscountBadge>
              <p className="text-sm font-medium text-gray-700">High</p>
              <p className="text-xs text-gray-500">Animated & glowing</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Guide */}
      <Card className="border-2 border-dashed border-muted-foreground/20">
        <CardHeader>
          <CardTitle className="text-xl text-[#7d3600] flex items-center gap-2">
            💻 Usage Examples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-6 overflow-x-auto">
            <pre className="text-sm text-gray-800">
{`import { DiscountBadge } from "@/components/ui/discount-badge";

// Basic usage
<DiscountBadge variant="tab" badgeColor="sale">25% OFF</DiscountBadge>

// High impact animated badge
<DiscountBadge
  variant="tab"
  badgeColor="hot"
  size="lg"
  intensity="high"
  position="top-left"
  glowEffect={true}
>
  50% OFF
</DiscountBadge>

// Subtle new product indicator
<DiscountBadge
  variant="corner"
  badgeColor="new"
  size="sm"
  intensity="medium"
>
  NEW
</DiscountBadge>`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Demo */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-xl text-[#7d3600] flex items-center gap-2">
            🎯 Interactive Examples
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Flash Sale */}
            <div className="text-center space-y-3 p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <DiscountBadge variant="flag" badgeColor="hot" size="md" intensity="high">
                FLASH SALE
              </DiscountBadge>
              <p className="text-sm font-medium">Flash Sale Banner</p>
            </div>

            {/* Bulk Discount */}
            <div className="text-center space-y-3 p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <DiscountBadge variant="folded" badgeColor="primary" size="md" intensity="medium">
                BUY 2 GET 1
              </DiscountBadge>
              <p className="text-sm font-medium">Bulk Offers</p>
            </div>

            {/* Seasonal */}
            <div className="text-center space-y-3 p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <DiscountBadge variant="ribbon" badgeColor="accent" size="md" intensity="medium">
                WINTER SALE
              </DiscountBadge>
              <p className="text-sm font-medium">Seasonal Promos</p>
            </div>

            {/* Exclusive */}
            <div className="text-center space-y-3 p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <DiscountBadge variant="simple" badgeColor="limited" size="md" intensity="high">
                EXCLUSIVE
              </DiscountBadge>
              <p className="text-sm font-medium">Member Exclusive</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscountBadgeShowcase;
