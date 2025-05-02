import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  const categories = ["Eletrônicos", "Vestuário", "Livros", "Casa & Jardim", "Esportes"];

  return (
    <footer className="bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">ShopEasy</span>
            </div>
            <p className="text-neutral-500 text-base">
              Tornando suas compras online simples, rápidas e seguras.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-neutral-400 hover:text-neutral-500">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-neutral-500">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-neutral-500">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-neutral-500">
                <span className="sr-only">YouTube</span>
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-neutral-600 tracking-wider uppercase">
                  Produtos
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  {categories.map((category) => (
                    <li key={category}>
                      <Link href={`/products?category=${encodeURIComponent(category)}`}>
                        <a className="text-base text-neutral-500 hover:text-neutral-900">
                          {category}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-neutral-600 tracking-wider uppercase">
                  Suporte
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      Central de Ajuda
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      Política de Troca
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      Entregas
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      Contato
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-neutral-600 tracking-wider uppercase">
                  Empresa
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      Sobre
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      Trabalhe Conosco
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      Parceiros
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-neutral-600 tracking-wider uppercase">
                  Legal
                </h3>
                <ul role="list" className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      Privacidade
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-neutral-500 hover:text-neutral-900">
                      Termos
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-neutral-200 pt-8">
          <p className="text-base text-neutral-400 text-center">
            &copy; {new Date().getFullYear()} ShopEasy, Inc. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
