"use client";

import { useState } from "react";
import { ReptileSpecialty } from "@/app/types/common";
import { CreateVeterinarianRequest } from "@/features/veterinarians/models";
import { veterinarianService } from "@/features/veterinarians/services";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface CreateVeterinarianFormProps {
  onSuccess?: () => void;
}

export function CreateVeterinarianForm({
  onSuccess,
}: CreateVeterinarianFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateVeterinarianRequest>({
    fullName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    specialties: [],
    yearsOfExperience: 0,
    clinicName: "",
    clinicAddress: "",
    city: "",
    state: "",
    zipCode: "",
    bio: "",
    consultationFee: 0,
    availableForOnlineConsultation: false,
  });

  const specialties: { value: ReptileSpecialty; label: string }[] = [
    { value: ReptileSpecialty.SNAKES, label: "Serpentes" },
    { value: ReptileSpecialty.LIZARDS, label: "Lagartos" },
    { value: ReptileSpecialty.TURTLES, label: "Tartarugas" },
    { value: ReptileSpecialty.CROCODILIANS, label: "Crocodilianos" },
    { value: ReptileSpecialty.AMPHIBIANS, label: "Anfíbios" },
    { value: ReptileSpecialty.GENERAL, label: "Geral" },
  ];

  const toggleSpecialty = (specialty: ReptileSpecialty) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await veterinarianService.createVeterinarian(formData);
      toast.success("Perfil de veterinário cadastrado com sucesso!");
      setIsDialogOpen(false);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        licenseNumber: "",
        specialties: [],
        yearsOfExperience: 0,
        clinicName: "",
        clinicAddress: "",
        city: "",
        state: "",
        zipCode: "",
        bio: "",
        consultationFee: 0,
        availableForOnlineConsultation: false,
      });
      onSuccess?.();
    } catch (error: any) {
      console.error("Erro ao criar perfil de veterinário:", error);
      toast.error(
        error?.response?.data || "Erro ao criar perfil. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md transition-all whitespace-nowrap shrink-0">
          <Plus className="mr-2 h-4 w-4 shrink-0" />
          <span className="hidden md:inline">Cadastrar Perfil</span>
          <span className="hidden sm:inline md:hidden">Cadastrar</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Perfil de Veterinário</DialogTitle>
          <DialogDescription>
            Preencha os dados do seu perfil profissional.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="fullName" className="text-sm font-medium">
              Nome Completo
            </label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="Seu nome completo"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="seu@email.com"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Telefone
            </label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="(00) 00000-0000"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="licenseNumber" className="text-sm font-medium">
              Número de Registro CRMV
            </label>
            <Input
              id="licenseNumber"
              value={formData.licenseNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  licenseNumber: e.target.value,
                })
              }
              placeholder="CRMV-XX 00000"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Especialidades</label>
            <div className="flex flex-wrap gap-2">
              {specialties.map((spec) => (
                <button
                  key={spec.value}
                  type="button"
                  onClick={() => toggleSpecialty(spec.value)}
                  className={`px-3 py-1 rounded-md text-sm border transition-colors ${
                    formData.specialties.includes(spec.value)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-input hover:bg-accent"
                  }`}
                >
                  {spec.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <label
              htmlFor="yearsOfExperience"
              className="text-sm font-medium"
            >
              Anos de Experiência
            </label>
            <Input
              id="yearsOfExperience"
              type="number"
              min="0"
              value={formData.yearsOfExperience}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  yearsOfExperience: parseInt(e.target.value) || 0,
                })
              }
              placeholder="0"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="clinicName" className="text-sm font-medium">
              Nome da Clínica
            </label>
            <Input
              id="clinicName"
              value={formData.clinicName}
              onChange={(e) =>
                setFormData({ ...formData, clinicName: e.target.value })
              }
              placeholder="Nome da clínica"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="clinicAddress" className="text-sm font-medium">
              Endereço da Clínica
            </label>
            <Input
              id="clinicAddress"
              value={formData.clinicAddress}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  clinicAddress: e.target.value,
                })
              }
              placeholder="Rua, número"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="grid gap-2">
              <label htmlFor="city" className="text-sm font-medium">
                Cidade
              </label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="Cidade"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="state" className="text-sm font-medium">
                Estado (UF)
              </label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    state: e.target.value.toUpperCase(),
                  })
                }
                placeholder="UF"
                maxLength={2}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="zipCode" className="text-sm font-medium">
              CEP
            </label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) =>
                setFormData({ ...formData, zipCode: e.target.value })
              }
              placeholder="00000-000"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="bio" className="text-sm font-medium">
              Biografia
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Conte um pouco sobre você..."
              className="min-h-[100px] rounded-md border border-input bg-input/30 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="consultationFee" className="text-sm font-medium">
              Taxa de Consulta (R$)
            </label>
            <Input
              id="consultationFee"
              type="number"
              step="0.01"
              min="0"
              value={formData.consultationFee}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  consultationFee: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0.00"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="onlineConsultation"
              checked={formData.availableForOnlineConsultation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  availableForOnlineConsultation: e.target.checked,
                })
              }
              className="h-4 w-4 rounded border-input"
            />
            <label
              htmlFor="onlineConsultation"
              className="text-sm font-medium"
            >
              Oferece consultas online
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !formData.fullName ||
              !formData.email ||
              !formData.licenseNumber
            }
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

