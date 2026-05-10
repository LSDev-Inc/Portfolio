"use client";

import { useActionState, useEffect } from "react";
import {
  Archive,
  CheckCircle2,
  Edit3,
  Inbox,
  LayoutDashboard,
  MessageSquareText,
  Plus,
  Save,
  Settings,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

import {
  deleteEntityAction,
  replyChatAction,
  saveExperienceAction,
  saveNoteAction,
  saveProjectAction,
  saveSettingsAction,
  saveSkillAction,
  saveSkillCategoryAction,
  setConversationStatusAction,
  updateContactStatusAction,
} from "@/actions/admin";
import { logoutAction } from "@/actions/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type ActionState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

type AdminData = {
  settings: Record<string, string | boolean | null> | null;
  projects: Array<Record<string, unknown>>;
  skillCategories: Array<Record<string, unknown>>;
  skills: Array<Record<string, unknown>>;
  experiences: Array<Record<string, unknown>>;
  contacts: Array<Record<string, unknown>>;
  conversations: Array<Record<string, unknown> & { messages: Array<Record<string, unknown>> }>;
  notes: Array<Record<string, unknown>>;
};

const initialState: ActionState = {};

const adminStatsIcons: Array<[string, keyof AdminData, LucideIcon]> = [
  ["Projects", "projects", LayoutDashboard],
  ["Skills", "skills", Sparkles],
  ["Contacts", "contacts", Inbox],
  ["Chat unread", "conversations", MessageSquareText],
];

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function bool(value: unknown) {
  return value === true;
}

function list(value: unknown) {
  return Array.isArray(value) ? value.join(", ") : "";
}

function dateInput(value: unknown) {
  return typeof value === "string" ? value.slice(0, 10) : "";
}

function FormShell({
  action,
  children,
  submitLabel = "Salva",
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (!state.message) return;
    if (state.ok) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="grid gap-4">
      {children}
      {state.message && !state.ok && (
        <p className="rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      )}
      <Button type="submit" disabled={pending} className="rounded-full">
        <Save className="h-4 w-4" />
        {pending ? "Salvataggio..." : submitLabel}
      </Button>
    </form>
  );
}

function DeleteButton({ entity, id }: { entity: string; id: string }) {
  return (
    <form action={deleteEntityAction}>
      <input type="hidden" name="entity" value={entity} />
      <input type="hidden" name="id" value={id} />
      <Button size="icon" variant="ghost" className="rounded-full text-destructive" aria-label="Elimina">
        <Trash2 className="h-4 w-4" />
      </Button>
    </form>
  );
}

function Field({
  name,
  label,
  defaultValue,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue} />
    </div>
  );
}

function TextAreaField({
  name,
  label,
  defaultValue,
  rows = 4,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} defaultValue={defaultValue} rows={rows} />
    </div>
  );
}

function ProjectDialog({ project }: { project?: Record<string, unknown> }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={project ? "ghost" : "default"} size={project ? "icon" : "sm"} className="rounded-full">
          {project ? <Edit3 className="h-4 w-4" /> : <><Plus className="h-4 w-4" /> Nuovo progetto</>}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{project ? "Modifica progetto" : "Nuovo progetto"}</DialogTitle>
        </DialogHeader>
        <FormShell action={saveProjectAction}>
          {project && <input type="hidden" name="id" value={text(project.id)} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="title" label="Titolo" defaultValue={text(project?.title)} />
            <Field name="slug" label="Slug" defaultValue={text(project?.slug)} />
            <Field name="category" label="Categoria" defaultValue={text(project?.category)} />
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select name="status" defaultValue={text(project?.status) || "LIVE"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LIVE">Live</SelectItem>
                  <SelectItem value="IN_PROGRESS">In progress</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Field name="impact" label="Impatto" defaultValue={text(project?.impact)} />
            <Field name="role" label="Ruolo" defaultValue={text(project?.role)} />
            <Field name="client" label="Cliente" defaultValue={text(project?.client)} />
            <Field name="order" label="Ordine" type="number" defaultValue={String(project?.order ?? 0)} />
          </div>
          <Field name="imageUrl" label="Image URL" defaultValue={text(project?.imageUrl)} />
          <TextAreaField name="summary" label="Summary" defaultValue={text(project?.summary)} />
          <TextAreaField name="description" label="Descrizione" rows={6} defaultValue={text(project?.description)} />
          <TextAreaField name="stack" label="Stack (separato da virgole)" defaultValue={list(project?.stack)} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="demoUrl" label="Demo URL" defaultValue={text(project?.demoUrl)} />
            <Field name="repoUrl" label="Repo URL" defaultValue={text(project?.repoUrl)} />
          </div>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="featured" value="true" defaultChecked={bool(project?.featured)} className="h-4 w-4" />
            Featured
          </label>
        </FormShell>
      </DialogContent>
    </Dialog>
  );
}

function ExperienceDialog({ item }: { item?: Record<string, unknown> }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={item ? "ghost" : "default"} size={item ? "icon" : "sm"} className="rounded-full">
          {item ? <Edit3 className="h-4 w-4" /> : <><Plus className="h-4 w-4" /> Nuova esperienza</>}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item ? "Modifica esperienza" : "Nuova esperienza"}</DialogTitle>
        </DialogHeader>
        <FormShell action={saveExperienceAction}>
          {item && <input type="hidden" name="id" value={text(item.id)} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="title" label="Titolo" defaultValue={text(item?.title)} />
            <Field name="organization" label="Organizzazione" defaultValue={text(item?.organization)} />
            <Field name="location" label="Location" defaultValue={text(item?.location)} />
            <Field name="order" label="Ordine" type="number" defaultValue={String(item?.order ?? 0)} />
            <Field name="startDate" label="Inizio" type="date" defaultValue={dateInput(item?.startDate)} />
            <Field name="endDate" label="Fine" type="date" defaultValue={dateInput(item?.endDate)} />
          </div>
          <div className="grid gap-2">
            <Label>Tipo</Label>
            <Select name="type" defaultValue={text(item?.type) || "WORK"}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="WORK">Work</SelectItem>
                <SelectItem value="EDUCATION">Education</SelectItem>
                <SelectItem value="CERTIFICATION">Certification</SelectItem>
                <SelectItem value="MILESTONE">Milestone</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="current" value="true" defaultChecked={bool(item?.current)} className="h-4 w-4" />
            Attuale
          </label>
          <TextAreaField name="summary" label="Summary" defaultValue={text(item?.summary)} />
          <TextAreaField name="highlights" label="Highlights (virgole o righe)" defaultValue={list(item?.highlights)} />
        </FormShell>
      </DialogContent>
    </Dialog>
  );
}

function SkillDialog({
  skill,
  categories,
}: {
  skill?: Record<string, unknown>;
  categories: Array<Record<string, unknown>>;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={skill ? "ghost" : "default"} size={skill ? "icon" : "sm"} className="rounded-full">
          {skill ? <Edit3 className="h-4 w-4" /> : <><Plus className="h-4 w-4" /> Nuova skill</>}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{skill ? "Modifica skill" : "Nuova skill"}</DialogTitle>
        </DialogHeader>
        <FormShell action={saveSkillAction}>
          {skill && <input type="hidden" name="id" value={text(skill.id)} />}
          <Field name="name" label="Nome" defaultValue={text(skill?.name)} />
          <Field name="level" label="Livello" type="number" defaultValue={String(skill?.level ?? 80)} />
          <Field name="order" label="Ordine" type="number" defaultValue={String(skill?.order ?? 0)} />
          <TextAreaField name="description" label="Descrizione" defaultValue={text(skill?.description)} />
          <div className="grid gap-2">
            <Label>Categoria</Label>
            <Select name="categoryId" defaultValue={text(skill?.categoryId) || text(categories[0]?.id)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={text(category.id)} value={text(category.id)}>
                    {text(category.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="featured" value="true" defaultChecked={bool(skill?.featured)} className="h-4 w-4" />
            Featured
          </label>
        </FormShell>
      </DialogContent>
    </Dialog>
  );
}

function SkillCategoryDialog({ category }: { category?: Record<string, unknown> }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={category ? "ghost" : "outline"} size={category ? "icon" : "sm"} className="rounded-full">
          {category ? <Edit3 className="h-4 w-4" /> : <><Plus className="h-4 w-4" /> Categoria</>}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Modifica categoria" : "Nuova categoria"}</DialogTitle>
        </DialogHeader>
        <FormShell action={saveSkillCategoryAction}>
          {category && <input type="hidden" name="id" value={text(category.id)} />}
          <Field name="name" label="Nome" defaultValue={text(category?.name)} />
          <Field name="order" label="Ordine" type="number" defaultValue={String(category?.order ?? 0)} />
          <TextAreaField name="description" label="Descrizione" defaultValue={text(category?.description)} />
        </FormShell>
      </DialogContent>
    </Dialog>
  );
}

function NoteDialog({ note }: { note?: Record<string, unknown> }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={note ? "ghost" : "default"} size={note ? "icon" : "sm"} className="rounded-full">
          {note ? <Edit3 className="h-4 w-4" /> : <><Plus className="h-4 w-4" /> Nuova nota</>}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{note ? "Modifica nota" : "Nuova nota"}</DialogTitle>
        </DialogHeader>
        <FormShell action={saveNoteAction}>
          {note && <input type="hidden" name="id" value={text(note.id)} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="title" label="Titolo" defaultValue={text(note?.title)} />
            <Field name="slug" label="Slug" defaultValue={text(note?.slug)} />
          </div>
          <Field name="imageUrl" label="Image URL" defaultValue={text(note?.imageUrl)} />
          <TextAreaField name="excerpt" label="Excerpt" defaultValue={text(note?.excerpt)} />
          <TextAreaField name="content" label="Content" rows={7} defaultValue={text(note?.content)} />
          <Field name="tags" label="Tags" defaultValue={list(note?.tags)} />
          <Field name="publishedAt" label="Published at" type="date" defaultValue={dateInput(note?.publishedAt)} />
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="published" value="true" defaultChecked={bool(note?.published)} className="h-4 w-4" />
            Pubblicata
          </label>
        </FormShell>
      </DialogContent>
    </Dialog>
  );
}

function ReplyForm({ conversationId }: { conversationId: string }) {
  return (
    <FormShell action={replyChatAction} submitLabel="Rispondi">
      <input type="hidden" name="conversationId" value={conversationId} />
      <Textarea name="message" placeholder="Scrivi una risposta..." rows={3} />
    </FormShell>
  );
}

export function AdminDashboard({ data }: { data: AdminData }) {
  const unreadContacts = data.contacts.filter((item) => text(item.status) === "UNREAD").length;
  const unreadChats = data.conversations.reduce(
    (total, item) => total + Number(item.unreadAdmin ?? 0),
    0,
  );

  return (
    <main className="min-h-dvh bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Badge className="mb-3 rounded-full bg-cyan-300/10 text-cyan-600 dark:text-cyan-200">
              <Sparkles className="mr-2 h-4 w-4" />
              Portfolio Command Center
            </Badge>
            <h1 className="text-3xl font-semibold tracking-normal sm:text-5xl">
              Admin dashboard
            </h1>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <a href="/" target="_blank">Apri sito</a>
            </Button>
            <form action={logoutAction}>
              <Button variant="secondary" className="rounded-full">Logout</Button>
            </form>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {adminStatsIcons.map(([label, key, Icon]) => {
            const value =
              label === "Contacts"
                ? unreadContacts
                : label === "Chat unread"
                  ? unreadChats
                  : Array.isArray(data[key])
                    ? data[key].length
                    : 0;

            return (
            <Card key={label} className="border-white/10 bg-white/70 backdrop-blur-xl dark:bg-white/[0.055]">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-1 text-3xl font-semibold">{String(value)}</p>
                </div>
                <Icon className="h-5 w-5 text-cyan-500 dark:text-cyan-300" />
              </CardContent>
            </Card>
            );
          })}
        </div>

        <Tabs defaultValue="projects" className="mt-8">
          <TabsList className="flex h-auto flex-wrap justify-start rounded-lg bg-muted/65 p-1">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-6">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Projects</CardTitle>
                <ProjectDialog />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Titolo</TableHead><TableHead>Categoria</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Azioni</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {data.projects.map((project) => (
                      <TableRow key={text(project.id)}>
                        <TableCell className="font-medium">{text(project.title)}</TableCell>
                        <TableCell>{text(project.category)}</TableCell>
                        <TableCell><Badge variant="outline">{text(project.status)}</Badge></TableCell>
                        <TableCell className="flex justify-end gap-1">
                          <ProjectDialog project={project} />
                          <DeleteButton entity="project" id={text(project.id)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Categories</CardTitle>
                <SkillCategoryDialog />
              </CardHeader>
              <CardContent className="grid gap-3">
                {data.skillCategories.map((category) => (
                  <div key={text(category.id)} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{text(category.name)}</p>
                      <p className="text-xs text-muted-foreground">{text(category.description)}</p>
                    </div>
                    <div className="flex gap-1">
                      <SkillCategoryDialog category={category} />
                      <DeleteButton entity="skillCategory" id={text(category.id)} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Skills</CardTitle>
                <SkillDialog categories={data.skillCategories} />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Categoria</TableHead><TableHead>Livello</TableHead><TableHead className="text-right">Azioni</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {data.skills.map((skill) => (
                      <TableRow key={text(skill.id)}>
                        <TableCell>{text(skill.name)}</TableCell>
                        <TableCell>{text((skill.category as Record<string, unknown>)?.name)}</TableCell>
                        <TableCell>{String(skill.level)}%</TableCell>
                        <TableCell className="flex justify-end gap-1">
                          <SkillDialog skill={skill} categories={data.skillCategories} />
                          <DeleteButton entity="skill" id={text(skill.id)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="mt-6">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Experience / Journey</CardTitle>
                <ExperienceDialog />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Titolo</TableHead><TableHead>Org</TableHead><TableHead>Tipo</TableHead><TableHead className="text-right">Azioni</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {data.experiences.map((item) => (
                      <TableRow key={text(item.id)}>
                        <TableCell>{text(item.title)}</TableCell>
                        <TableCell>{text(item.organization)}</TableCell>
                        <TableCell><Badge variant="outline">{text(item.type)}</Badge></TableCell>
                        <TableCell className="flex justify-end gap-1">
                          <ExperienceDialog item={item} />
                          <DeleteButton entity="experience" id={text(item.id)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Contatti ricevuti</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {data.contacts.map((contact) => (
                  <div key={text(contact.id)} className="rounded-lg border p-4">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row">
                      <div>
                        <p className="font-semibold">{text(contact.subject)}</p>
                        <p className="text-sm text-muted-foreground">{text(contact.name)} / {text(contact.email)}</p>
                        <p className="mt-3 text-sm leading-6">{text(contact.message)}</p>
                      </div>
                      <Badge className="h-fit" variant={text(contact.status) === "UNREAD" ? "default" : "secondary"}>{text(contact.status)}</Badge>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex flex-wrap gap-2">
                      {["READ", "REPLIED", "ARCHIVED"].map((status) => (
                        <form key={status} action={updateContactStatusAction}>
                          <input type="hidden" name="id" value={text(contact.id)} />
                          <input type="hidden" name="status" value={status} />
                          <Button size="sm" variant="outline" className="rounded-full">{status}</Button>
                        </form>
                      ))}
                      <DeleteButton entity="contact" id={text(contact.id)} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="mt-6 grid gap-4 lg:grid-cols-2">
            {data.conversations.map((conversation) => (
              <Card key={text(conversation.id)}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle>{text(conversation.visitorName) || "Visitor"}</CardTitle>
                      <p className="text-sm text-muted-foreground">{text(conversation.visitorEmail) || text(conversation.visitorId)}</p>
                    </div>
                    <Badge variant={text(conversation.status) === "OPEN" ? "default" : "secondary"}>
                      {text(conversation.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid max-h-72 gap-2 overflow-y-auto rounded-lg bg-muted/45 p-3">
                    {conversation.messages.map((message) => (
                      <div
                        key={text(message.id)}
                        className={`max-w-[88%] rounded-lg px-3 py-2 text-sm ${
                          text(message.sender) === "ADMIN"
                            ? "ml-auto bg-cyan-500 text-white"
                            : "bg-background"
                        }`}
                      >
                        {text(message.body)}
                      </div>
                    ))}
                  </div>
                  <ReplyForm conversationId={text(conversation.id)} />
                  <div className="flex flex-wrap gap-2">
                    <form action={setConversationStatusAction}>
                      <input type="hidden" name="id" value={text(conversation.id)} />
                      <input type="hidden" name="status" value={text(conversation.status) === "OPEN" ? "CLOSED" : "OPEN"} />
                      <Button size="sm" variant="outline" className="rounded-full">
                        <Archive className="h-4 w-4" />
                        {text(conversation.status) === "OPEN" ? "Chiudi" : "Riapri"}
                      </Button>
                    </form>
                    <DeleteButton entity="conversation" id={text(conversation.id)} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="notes" className="mt-6">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Notes</CardTitle>
                <NoteDialog />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Titolo</TableHead><TableHead>Tags</TableHead><TableHead>Stato</TableHead><TableHead className="text-right">Azioni</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {data.notes.map((note) => (
                      <TableRow key={text(note.id)}>
                        <TableCell>{text(note.title)}</TableCell>
                        <TableCell>{list(note.tags)}</TableCell>
                        <TableCell>{bool(note.published) ? <Badge><CheckCircle2 className="mr-1 h-3 w-3" />Live</Badge> : <Badge variant="secondary">Draft</Badge>}</TableCell>
                        <TableCell className="flex justify-end gap-1">
                          <NoteDialog note={note} />
                          <DeleteButton entity="note" id={text(note.id)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Impostazioni generali
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormShell action={saveSettingsAction} submitLabel="Salva impostazioni">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field name="ownerName" label="Nome" defaultValue={text(data.settings?.ownerName)} />
                    <Field name="professionalTitle" label="Titolo professionale" defaultValue={text(data.settings?.professionalTitle)} />
                    <Field name="location" label="Location" defaultValue={text(data.settings?.location)} />
                    <Field name="email" label="Email" type="email" defaultValue={text(data.settings?.email)} />
                    <Field name="availability" label="Disponibilita" defaultValue={text(data.settings?.availability)} />
                    <Field name="cvUrl" label="CV URL" defaultValue={text(data.settings?.cvUrl)} />
                  </div>
                  <Field name="headline" label="Headline" defaultValue={text(data.settings?.headline)} />
                  <Field name="heroKicker" label="Hero kicker" defaultValue={text(data.settings?.heroKicker)} />
                  <TextAreaField name="heroDescription" label="Hero description" rows={5} defaultValue={text(data.settings?.heroDescription)} />
                  <TextAreaField name="about" label="About me" rows={7} defaultValue={text(data.settings?.about)} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field name="primaryCtaLabel" label="Primary CTA label" defaultValue={text(data.settings?.primaryCtaLabel)} />
                    <Field name="primaryCtaHref" label="Primary CTA href" defaultValue={text(data.settings?.primaryCtaHref)} />
                    <Field name="secondaryCtaLabel" label="Secondary CTA label" defaultValue={text(data.settings?.secondaryCtaLabel)} />
                    <Field name="secondaryCtaHref" label="Secondary CTA href" defaultValue={text(data.settings?.secondaryCtaHref)} />
                    <Field name="githubUrl" label="GitHub" defaultValue={text(data.settings?.githubUrl)} />
                    <Field name="linkedinUrl" label="LinkedIn" defaultValue={text(data.settings?.linkedinUrl)} />
                    <Field name="twitterUrl" label="X / Twitter" defaultValue={text(data.settings?.twitterUrl)} />
                    <Field name="websiteUrl" label="Website" defaultValue={text(data.settings?.websiteUrl)} />
                    <Field name="accentName" label="Accent name" defaultValue={text(data.settings?.accentName)} />
                    <Field name="ogImage" label="OG image" defaultValue={text(data.settings?.ogImage)} />
                  </div>
                  <Field name="seoTitle" label="SEO title" defaultValue={text(data.settings?.seoTitle)} />
                  <TextAreaField name="seoDescription" label="SEO description" defaultValue={text(data.settings?.seoDescription)} />
                  <label className="flex items-center gap-3 text-sm">
                    <input type="checkbox" name="onlineStatus" value="true" defaultChecked={bool(data.settings?.onlineStatus)} className="h-4 w-4" />
                    Chat online
                  </label>
                </FormShell>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
