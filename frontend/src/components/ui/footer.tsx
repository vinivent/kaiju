import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image src={"/assets/kaiju.png"} height={60} width={60} alt="Kaiju Logo" />
            </div>
            <p className="text-sm text-muted-foreground">
              Sua plataforma completa para cuidados com répteis
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 font-semibold">Produtos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/produtos?category=FOOD" className="hover:text-foreground transition-colors">Alimentação</Link></li>
              <li><Link href="/produtos?category=HABITAT" className="hover:text-foreground transition-colors">Habitat</Link></li>
              <li><Link href="/produtos?category=HEATING" className="hover:text-foreground transition-colors">Aquecimento</Link></li>
              <li><Link href="/produtos?category=LIGHTING" className="hover:text-foreground transition-colors">Iluminação</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Serviços</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/veterinarios" className="hover:text-foreground transition-colors">Veterinários</Link></li>
              <li><Link href="/locais" className="hover:text-foreground transition-colors">Clínicas</Link></li>
              <li><Link href="/artigos" className="hover:text-foreground transition-colors">Guias de Cuidados</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4 font-semibold">Conecte-se</h3>
            <div className="flex space-x-4">
              <a href="https://github.com/vinivent" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://github.com/vinivent" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://github.com/vinivent" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://github.com/vinivent" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Kaiju. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
