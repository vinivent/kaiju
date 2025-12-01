import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Video, User, Award } from "lucide-react";
import { Veterinarian } from "@/features/veterinarians/models";
import { ReptileSpecialty } from "@/app/types/common";
import { createWhatsAppLink } from "@/lib/formatters";
import Image from "next/image";

interface VeterinarianCardProps {
  veterinarian: Veterinarian;
  specialtyLabels: Record<ReptileSpecialty | "ALL", string>;
}

export function VeterinarianCard({
  veterinarian: vet,
  specialtyLabels,
}: VeterinarianCardProps) {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-border/50 hover:border-primary/20 flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-muted to-muted/50 rounded-t-xl">
          {vet.profilePicture ? (
            <Image
              src={vet.profilePicture}
              alt={vet.fullName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="h-20 w-20 text-muted-foreground opacity-50" />
            </div>
          )}
          {vet.availableForOnlineConsultation && (
            <div className="absolute top-4 right-4 z-10">
              <Badge
                variant="secondary"
                className="backdrop-blur-sm bg-background/80 gap-1.5"
              >
                <Video className="h-3 w-3" />
                Online
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="mb-2">
            <h3 className="text-xl font-bold mb-1">{vet.fullName}</h3>
            <p className="text-sm text-muted-foreground">{vet.clinicName}</p>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">
                {(vet.rating ?? 0).toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              ({vet.reviewCount ?? 0} avaliações)
            </span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
            {vet.bio}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {(vet.specialties || []).slice(0, 2).map((spec) => (
              <Badge
                key={spec}
                variant="secondary"
                className="text-xs px-2 py-0.5"
              >
                {specialtyLabels[spec] || spec}
              </Badge>
            ))}
            {(vet.specialties || []).length > 2 && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                +{(vet.specialties || []).length - 2}
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {vet.city}, {vet.state}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="h-4 w-4 flex-shrink-0" />
            <span>{vet.yearsOfExperience} anos de experiência</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xl font-bold text-primary">
                R$ {(vet.consultationFee ?? 0).toFixed(2).replace(".", ",")}
              </p>
              <p className="text-xs text-muted-foreground">por consulta</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-3">
        {vet.phoneNumber && (
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer w-full"
            asChild
          >
            <a
              href={createWhatsAppLink(vet.phoneNumber, vet.fullName)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
