"use client";

import { useState } from "react";
import { ReptileSpecialty } from "@/app/types/common";
import { CreateVeterinarianFormData } from "@/features/veterinarians/models";
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
import Image from "next/image";
import {
  formatPhone,
  formatCEP,
  formatCurrencyInput,
  formatState,
  isValidEmail,
  isValidPhone,
  isValidCEP,
  isValidURL,
  isValidCRMV,
  parseCurrency,
} from "@/lib/formatters";

interface CreateVeterinarianFormProps {
  onSuccess?: () => void;
}

export function CreateVeterinarianForm({
  onSuccess,
}: CreateVeterinarianFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consultationFeeDisplay, setConsultationFeeDisplay] = useState("");
  const [formData, setFormData] = useState<CreateVeterinarianFormData>({
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
    imageUrl: "",
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

  const validateForm = (): string | null => {
    if (!formData.fullName.trim()) {
      return "Nome completo é obrigatório.";
    }
    if (formData.fullName.trim().length < 3) {
      return "Nome completo deve ter pelo menos 3 caracteres.";
    }
    if (!formData.email.trim()) {
      return "E-mail é obrigatório.";
    }
    if (!isValidEmail(formData.email)) {
      return "E-mail inválido. Por favor, insira um e-mail válido.";
    }
    if (!formData.phone.trim()) {
      return "Telefone é obrigatório.";
    }
    if (!isValidPhone(formData.phone)) {
      return "Telefone inválido. Use o formato (00) 00000-0000.";
    }
    if (!formData.licenseNumber.trim()) {
      return "Número de CRMV é obrigatório.";
    }
    if (!isValidCRMV(formData.licenseNumber)) {
      return "Número de CRMV inválido.";
    }
    if (formData.specialties.length === 0) {
      return "Selecione pelo menos uma especialidade.";
    }
    if (formData.yearsOfExperience < 0) {
      return "Anos de experiência não podem ser negativos.";
    }
    if (formData.zipCode && !isValidCEP(formData.zipCode)) {
      return "CEP inválido. Use o formato 00000-000.";
    }
    if (formData.state && formData.state.length !== 2) {
      return "Estado deve ter 2 caracteres (UF).";
    }
    if (formData.imageUrl && !isValidURL(formData.imageUrl)) {
      return "URL da imagem inválida.";
    }
    if (formData.consultationFee < 0) {
      return "Taxa de consulta não pode ser negativa.";
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

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
        imageUrl: "",
        consultationFee: 0,
        availableForOnlineConsultation: false,
      });
      setConsultationFeeDisplay("");
      onSuccess?.();
    } catch (error: unknown) {
      console.error("Erro ao criar perfil de veterinário:", error);

      // Extract error message from different possible formats
      let errorMessage = "Erro ao criar perfil. Tente novamente.";

      const errorData = error as {
        response?: {
          data?: string | { message?: string; error?: string };
        };
        message?: string;
      };

      if (errorData?.response?.data) {
        if (typeof errorData.response.data === "string") {
          errorMessage = errorData.response.data;
        } else if (errorData.response.data.message) {
          errorMessage = errorData.response.data.message;
        } else if (errorData.response.data.error) {
          errorMessage = errorData.response.data.error;
        }
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }

      // Handle specific error cases
      if (
        errorMessage.includes("already have a veterinarian profile") ||
        errorMessage.includes("duplicate key") ||
        errorMessage.includes("already exists")
      ) {
        errorMessage =
          "Você já possui um perfil de veterinário cadastrado. Use a opção de editar para atualizar seu perfil.";
      } else if (errorMessage.includes("License number already registered")) {
        errorMessage = "Este número de CRMV já está cadastrado.";
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Reset form when dialog closes
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
        imageUrl: "",
        consultationFee: 0,
        availableForOnlineConsultation: false,
      });
      setConsultationFeeDisplay("");
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
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
            <label htmlFor="imageUrl" className="text-sm font-medium">
              Foto de Perfil (URL)
            </label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl || ""}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              onBlur={(e) => {
                if (e.target.value && !isValidURL(e.target.value)) {
                  toast.error("URL inválida. Por favor, insira uma URL válida.");
                }
              }}
              placeholder="https://exemplo.com/foto.jpg"
            />
            {formData.imageUrl && isValidURL(formData.imageUrl) && (
              <div className="mt-2 relative w-32 h-32 rounded-md border border-input overflow-hidden">
                <Image
                  src={formData.imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, email: value });
              }}
              onBlur={(e) => {
                if (e.target.value && !isValidEmail(e.target.value)) {
                  toast.error("E-mail inválido. Por favor, insira um e-mail válido.");
                }
              }}
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
              onChange={(e) => {
                const formatted = formatPhone(e.target.value);
                setFormData({ ...formData, phone: formatted });
              }}
              placeholder="(00) 00000-0000"
              maxLength={15}
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
                  licenseNumber: e.target.value.toUpperCase(),
                })
              }
              onBlur={(e) => {
                if (e.target.value && !isValidCRMV(e.target.value)) {
                  toast.error("Número de CRMV inválido. Use o formato CRMV-XX 00000.");
                }
              }}
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
            <label htmlFor="yearsOfExperience" className="text-sm font-medium">
              Anos de Experiência
            </label>
            <Input
              id="yearsOfExperience"
              type="number"
              min="0"
              max="100"
              value={formData.yearsOfExperience || ""}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                if (value >= 0 && value <= 100) {
                  setFormData({
                    ...formData,
                    yearsOfExperience: value,
                  });
                }
              }}
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
                    state: formatState(e.target.value),
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
              onChange={(e) => {
                const formatted = formatCEP(e.target.value);
                setFormData({ ...formData, zipCode: formatted });
              }}
              placeholder="00000-000"
              maxLength={9}
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
              type="text"
              value={consultationFeeDisplay}
              onChange={(e) => {
                const value = e.target.value;
                const formatted = formatCurrencyInput(value);
                setConsultationFeeDisplay(formatted);
                const numericValue = parseCurrency(value);
                if (numericValue >= 0 && numericValue <= 999999.99) {
                  setFormData({
                    ...formData,
                    consultationFee: numericValue,
                  });
                }
              }}
              onBlur={() => {
                if (formData.consultationFee === 0) {
                  setConsultationFeeDisplay("");
                }
              }}
              placeholder="0,00"
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
            <label htmlFor="onlineConsultation" className="text-sm font-medium">
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
