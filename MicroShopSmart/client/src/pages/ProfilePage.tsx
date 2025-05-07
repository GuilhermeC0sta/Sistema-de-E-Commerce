import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { User } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Settings, User as UserIcon } from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  // Fetch user orders
  const { data: orders, isLoading: isLoadingOrders } = useQuery<any[]>({
    queryKey: ["/api/user", user?.id, "orders"],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await fetch(`/api/user/${user.id}/orders`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      return response.json();
    },
    enabled: !!user?.id,
  });

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="text-center">
              <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <UserIcon size={36} className="text-primary-600" />
              </div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription className="text-sm text-neutral-500">{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Informações Pessoais
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Package className="mr-2 h-4 w-4" />
                  Pedidos
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-9">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
              <TabsTrigger value="orders">Meus Pedidos</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>
                    Visualize e edite suas informações pessoais.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500">Nome</h3>
                      <p className="mt-1 text-base">{user.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500">Email</h3>
                      <p className="mt-1 text-base">{user.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500">Endereço</h3>
                      <p className="mt-1 text-base">{user.address || "Nenhum endereço cadastrado"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500">Cidade</h3>
                      <p className="mt-1 text-base">{user.city || "Não informado"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500">Estado</h3>
                      <p className="mt-1 text-base">{user.state || "Não informado"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500">CEP</h3>
                      <p className="mt-1 text-base">{user.zipcode || "Não informado"}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button>Editar Informações</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Meus Pedidos</CardTitle>
                  <CardDescription>
                    Veja o histórico de todos os seus pedidos.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingOrders ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="border rounded-lg p-4">
                          <div className="flex justify-between mb-4">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-32" />
                          </div>
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ))}
                    </div>
                  ) : orders && orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders && orders.map((order: any) => (
                        <div key={order.id} className="border rounded-lg p-4 hover:border-primary-300 transition-colors">
                          <div className="flex flex-col sm:flex-row justify-between mb-2">
                            <div>
                              <span className="text-sm text-neutral-500">Pedido #</span>
                              <span className="font-medium">{order.id}</span>
                            </div>
                            <div className="flex items-center mt-2 sm:mt-0">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === "completed" ? "bg-green-100 text-green-800" :
                                order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                order.status === "processing" ? "bg-blue-100 text-blue-800" :
                                order.status === "paid" ? "bg-green-100 text-green-800" :
                                order.status === "canceled" ? "bg-red-100 text-red-800" :
                                "bg-blue-100 text-blue-800"
                              }`}>
                                {order.status === "completed" ? "Entregue" :
                                 order.status === "pending" ? "Pendente" :
                                 order.status === "processing" ? "Em processamento" :
                                 order.status === "paid" ? "Aprovado" :
                                 order.status === "canceled" ? "Cancelado" :
                                 order.status}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-neutral-500">Data</span>
                              <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('pt-BR') : '-'}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                              <span className="text-neutral-500">Total</span>
                              <span className="font-medium">R$ {Number(order.total).toFixed(2).replace('.', ',')}</span>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button variant="outline" size="sm" className="w-full sm:w-auto">
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
                      <h3 className="text-lg font-medium text-neutral-900">Nenhum pedido encontrado</h3>
                      <p className="mt-2 text-neutral-500">Você ainda não fez nenhum pedido.</p>
                      <Button variant="outline" className="mt-4" onClick={() => navigate("/products")}>
                        Explorar Produtos
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações</CardTitle>
                  <CardDescription>
                    Gerencie as configurações da sua conta.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium">Notificações por email</h3>
                        <p className="text-sm text-neutral-500">Receba emails sobre suas atividades, pedidos e ofertas.</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium">Autenticação de dois fatores</h3>
                        <p className="text-sm text-neutral-500">Adicione uma camada extra de segurança à sua conta.</p>
                      </div>
                      <Button variant="outline">Configurar</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium">Alterar senha</h3>
                        <p className="text-sm text-neutral-500">Atualizar sua senha periodicamente aumenta a segurança.</p>
                      </div>
                      <Button variant="outline">Alterar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
