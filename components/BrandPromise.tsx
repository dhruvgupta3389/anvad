import { Leaf, Package, Eye, Recycle } from "lucide-react";

const BrandPromise = () => {
  const promises = [
    {
      icon: Leaf,
      title: "Natural Ingredients",
      description: "100% natural, organic ingredients sourced from trusted farms"
    },
    {
      icon: Package,
      title: "Plant-Based",
      description: "Completely plant-based formulations for pure wellness"
    },
    {
      icon: Eye,
      title: "Transparent Sourcing",
      description: "Full transparency in our sourcing and manufacturing process"
    },
    {
      icon: Recycle,
      title: "Eco-Friendly Packaging",
      description: "Sustainable packaging that cares for our planet"
    }
  ];

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#7d3600] mb-4">
            Our Promise to You
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to providing the highest quality wellness products 
            while caring for our planet and your health.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {promises.map((promise, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-2xl bg-[#F9F1E6] hover:bg-[#b84d00]/5 hover:border-[#b84d00] border border-transparent transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#7d3600] text-white rounded-full mb-4">
                <promise.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-[#7d3600] mb-3">
                {promise.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {promise.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
//1212
export default BrandPromise;
