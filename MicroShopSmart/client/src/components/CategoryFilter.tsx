import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const { data: categories, isLoading } = useQuery<string[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Categorias</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <div className="space-y-2">
          <button
            onClick={() => onSelectCategory("all")}
            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
              selectedCategory === "all"
                ? "bg-primary-100 text-primary-700"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            Todos os Produtos
          </button>
          
          {categories?.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                selectedCategory === category
                  ? "bg-primary-100 text-primary-700"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
