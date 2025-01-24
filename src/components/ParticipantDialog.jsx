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
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "./ui/checkbox";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { updateParticipant } from "@/lib/actions/participant.action";

// Zod validation schema
const sexOptions = ["Masculin", "Féminin"];
const maritalStatusOptions = ["Célibataire", "Fiancé(e)", "Marié(e)"];
const cellOptions = [
  "GBU INSTI",
  "GBU ENSET",
  "GBS AGAME",
  "GBS CEG2 LOKOSSA",
  "GBS CEG3 LOKOSSA",
  "GBS CEG4 LOKOSSA",
];
const statusOptions = ["Elève", "Etudiant", "Fonctionnaire"];
const paymentOptions = ["Mobile Money", "Espèces"];
const disabledInputStyles =
  "disabled:p-0 disabled:h-min disabled:border-0 disabled:cursor-default disabled:opacity-100 transition-all duration-200";

const participantSchema = z.object({
  name: z.string().min(2, { message: "Le nom est requis" }),
  email: z.string().email({ message: "Email invalide" }),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, { message: "Numéro de téléphone invalide" }),
  sex: z.enum(sexOptions),
  birthYear: z
    .string()
    .regex(/^\d{4}$/, { message: "Année invalide" })
    .refine(
      (val) => {
        const year = parseInt(val);
        return year >= 1900 && year <= new Date().getFullYear();
      },
      { message: "Année non valide" }
    ),
  cell: z.string().optional(),
  otherCell: z.boolean().optional(),
  church: z.string().min(1, { message: "Église requise" }),
  status: z.string().min(1, { message: "Fonction requise" }),
  otherStatus: z.boolean().optional(),
  maritalStatus: z.enum(maritalStatusOptions),
  paymentMode: z.string().min(1, { message: "Mode de paiement requis" }),
  otherPaymentMode: z.boolean().optional(),
});

export function ParticipantDialog({ participant }) {
  const [otherCell, setOtherCell] = useState(
    !cellOptions.includes(participant.cell)
  );
  const [otherStatus, setOtherStatus] = useState(
    statusOptions.indexOf(participant.status) === -1
  );
  const [otherPaymentMode, setOtherPaymentMode] = useState(
    paymentOptions.indexOf(participant.paymentMode) === -1
  );

  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const formRef = useRef();

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      name: participant.name,
      email: participant.email,
      phoneNumber: participant.phoneNumber,
      sex: participant.sex,
      birthYear: participant.birthYear,
      cell: otherCell ? participant.cell : "GBU INSTI",
      church: participant.church,
      status: otherStatus ? participant.status : "Etudiant",
      maritalStatus: participant.maritalStatus,
      paymentMode: otherPaymentMode ? participant.paymentMode : "Mobile Money",
    },
  });

  const onSubmit = async (data) => {
    console.log(data);

    setLoading(true);
    const participantToSend = { ...participant, ...data };
    try {
      const updatedParticipant = await updateParticipant(participantToSend);
      if (updatedParticipant)
        toast({
          title: "Succès",
          description: "Participant mis à jour!",
          duration: 5000,
        });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Le participant n'a pas été mis à jour",
        variant: "destructive",
        duration: 5000,
      });
      console.log("Erreur lors de la modification", error);
    } finally {
      setLoading(false);
      setActive(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full font-normal">
          Voir le participant
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full sm:max-w-[600px] max-h-[90%] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-primary">
            Détails du participant
          </DialogTitle>
          <DialogDescription>
            Vous pouvez modifier les informations ou supprimer le participant.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          ref={formRef}
          className="space-y-3 text-sm overflow-y-auto max-h-[70vh] p-1"
        >
          <div className="w-full place-items-center">
            <div className="relative">
              <Avatar className="h-28 w-28 rounded-full p-1 border-2 border-primary">
                <AvatarImage
                  className="rounded-full"
                  src={participant.imageURL}
                  alt={participant.name}
                />
                <AvatarFallback className="rounded-full">
                  {participant.name
                    ?.split(" ")
                    .map((i) => i[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="w-full space-y-1.5">
            <Label htmlFor="name">Nom et prénoms</Label>
            <Input
              disabled={!active}
              {...register("name")}
              className={`w-full ${disabledInputStyles}`}
              type="text"
              placeholder="Nom et prénoms"
            />
            {errors.name && (
              <p className="text-destructive text-xs">{errors.name.message}</p>
            )}
          </div>
          <div className="w-full gap-3 flex flex-wrap max-sm:flex-col">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                disabled={!active}
                {...register("email")}
                className={`w-full text-sm ${disabledInputStyles}`}
                type="email"
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-destructive text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
              <Input
                disabled={!active}
                {...register("phoneNumber")}
                className={`w-full text-sm ${disabledInputStyles}`}
                type="text"
                placeholder="XXXXXXXXXX"
              />
              {errors.phoneNumber && (
                <p className="text-destructive text-xs">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full space-y-1.5">
            <span className="font-medium">Sexe</span>
            <Controller
              name="sex"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  disabled={!active}
                  className="flex justify-between"
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Masculin" id="Masculin" />
                    <Label htmlFor="Masculin">Masculin</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Féminin" id="Féminin" />
                    <Label htmlFor="Féminin">Féminin</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.sex && (
              <p className="text-destructive text-xs">{errors.sex.message}</p>
            )}
          </div>
          <div className="w-full space-y-1.5">
            <Label htmlFor="birthYear">Année</Label>
            <Input
              disabled={!active}
              {...register("birthYear")}
              className={`w-full text-sm ${disabledInputStyles}`}
              type="number"
              placeholder="1958"
            />
            {errors.birthYear && (
              <p className="text-destructive text-xs">
                {errors.birthYear.message}
              </p>
            )}
          </div>
          <div className="w-full gap-3 flex flex-wrap max-sm:flex-col">
            <div className="flex-1 space-y-1.5">
              <div
                className={`${
                  active && "flex"
                } flex-row justify-between items-center gap-2`}
              >
                <Label htmlFor="cell">Cellule</Label>
                {active && (
                  <span className="flex gap-2 items-center font-medium">
                    <Checkbox
                      checked={otherCell}
                      onCheckedChange={() => setOtherCell(!otherCell)}
                    />{" "}
                    Autre
                  </span>
                )}
              </div>
              {!otherCell ? (
                <Controller
                  name="cell"
                  control={control}
                  render={({ field }) => (
                    <Select
                      disabled={!active}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className={`${disabledInputStyles}`}>
                        <SelectValue placeholder="Sélectionnez une cellule" />
                      </SelectTrigger>
                      <SelectContent>
                        {cellOptions.map((cellOption) => (
                          <SelectItem key={cellOption} value={cellOption}>
                            {cellOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <Input
                  disabled={!active}
                  {...register("cell")}
                  className={`w-full text-sm ${disabledInputStyles}`}
                  type="text"
                  placeholder="Autre cellule"
                />
              )}
            </div>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="church">Eglise</Label>
              <Input
                disabled={!active}
                {...register("church")}
                className={`w-full text-sm ${disabledInputStyles}`}
                type="text"
                placeholder="Votre église de provenance"
              />
              {errors.church && (
                <p className="text-destructive text-xs">
                  {errors.church.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full gap-3 flex flex-wrap max-sm:flex-col">
            <div className="flex-1 space-y-1.5">
              <div
                className={`${
                  active && "flex"
                } flex-row justify-between items-center gap-2`}
              >
                <Label htmlFor="status">Fonction</Label>
                {active && (
                  <span className="flex gap-2 items-center font-medium">
                    <Checkbox
                      checked={otherStatus}
                      onCheckedChange={() => setOtherStatus(!otherStatus)}
                    />{" "}
                    Autre
                  </span>
                )}
              </div>
              {!otherStatus ? (
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      disabled={!active}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className={`${disabledInputStyles}`}>
                        <SelectValue placeholder="Sélectionnez une fonction" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((statusOption) => (
                          <SelectItem key={statusOption} value={statusOption}>
                            {statusOption}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <Input
                  disabled={!active}
                  {...register("status")}
                  className={`w-full text-sm ${disabledInputStyles}`}
                  type="text"
                  placeholder="Autre fonction"
                />
              )}
              {errors.status && (
                <p className="text-destructive text-xs">
                  {errors.status.message}
                </p>
              )}
            </div>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="maritalStatus">Statut matrimonial</Label>
              <Controller
                name="maritalStatus"
                control={control}
                render={({ field }) => (
                  <Select
                    disabled={!active}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className={`${disabledInputStyles}`}>
                      <SelectValue placeholder="Sélectionnez un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      {maritalStatusOptions.map((maritalStatusOption) => (
                        <SelectItem
                          key={maritalStatusOption}
                          value={maritalStatusOption}
                        >
                          {maritalStatusOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.maritalStatus && (
                <p className="text-destructive text-xs">
                  {errors.maritalStatus.message}
                </p>
              )}
            </div>
          </div>
          <div className="w-full gap-3 flex flex-wrap max-sm:flex-col">
            <div
              className={`${
                active && "flex"
              } flex-row justify-between items-center gap-2 w-full`}
            >
              <Label htmlFor="paymentMode">Mode de paiement</Label>
              {active && (
                <span className="flex gap-2 items-center font-medium">
                  <Checkbox
                    checked={otherPaymentMode}
                    onCheckedChange={() =>
                      setOtherPaymentMode(!otherPaymentMode)
                    }
                  />{" "}
                  Autre
                </span>
              )}
            </div>
            {!otherPaymentMode ? (
              <Controller
                name="paymentMode"
                control={control}
                render={({ field }) => (
                  <Select
                    disabled={!active}
                    onValueChange={field.onChange}
                    value={field.value}
                    className="text-sm w-full"
                  >
                    <SelectTrigger className={`w-full ${disabledInputStyles}`}>
                      <SelectValue placeholder="Sélectionnez un mode de paiement" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentOptions.map((paymentOption) => (
                        <SelectItem key={paymentOption} value={paymentOption}>
                          {paymentOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            ) : (
              <Input
                disabled={!active}
                {...register("paymentMode")}
                className="w-full text-sm"
                type="text"
                placeholder="Autre mode de paiement"
              />
            )}
            {errors.paymentMode && (
              <p className="text-destructive text-xs">
                {errors.paymentMode.message}
              </p>
            )}
          </div>
        </form>
        <DialogFooter className="gap-2 max-sm:flex-col">
          <Button
            disabled={loading}
            onClick={() => {
              setActive((active) => !active);
            }}
            type="button"
          >
            {!active ? "Modifier" : "Annuler"}
          </Button>
          {active && (
            <Button
              onClick={() => {
                formRef.current.requestSubmit();
              }}
              disabled={loading}
              type="button"
            >
              Enregistrer
              {loading && <Loader className="animate-spin" />}
            </Button>
          )}
          <Button disabled={loading} type="button" variant="destructive">
            Supprimer le participant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
