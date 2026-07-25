import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { Settings, Save, CheckCircle, AlertCircle, Monitor, Volume2, Sparkles, Eye, Cpu } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import Button from "@/components/Button";
import { FormInput, FormLabel } from "@/components/FormElements";

interface SettingsData {
  darkModeDefault: boolean;
  language: string;
  soundToggle: boolean;
  animationToggle: boolean;
  accessibilityOptions: {
    screenReaderFriendly: boolean;
    highContrast: boolean;
  };
  themeTokens: {
    primaryColor: string;
    secondaryColor: string;
  };
  enabledSections: Record<string, boolean>;
}

interface LocalPreferences {
  darkMode: boolean;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  highContrast: boolean;
}

function getLocalPrefs(): LocalPreferences {
  try {
    const stored = localStorage.getItem("portfolio_prefs");
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { darkMode: true, soundEnabled: true, animationsEnabled: true, highContrast: false };
}

function saveLocalPrefs(prefs: LocalPreferences) {
  localStorage.setItem("portfolio_prefs", JSON.stringify(prefs));
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const isAdmin = useAuthStore((state) => state.user?.role === "admin");

  // Local visitor preferences
  const [localPrefs, setLocalPrefs] = useState<LocalPreferences>(getLocalPrefs);

  // Server-side admin settings
  const [adminForm, setAdminForm] = useState<SettingsData | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: serverSettings, isLoading } = useQuery<SettingsData>({
    queryKey: ["global-settings"],
    queryFn: async () => {
      const res = await api.get("/settings");
      return res.data.data;
    },
  });

  useEffect(() => {
    if (serverSettings && !adminForm) {
      setAdminForm({
        darkModeDefault: serverSettings.darkModeDefault,
        language: serverSettings.language,
        soundToggle: serverSettings.soundToggle,
        animationToggle: serverSettings.animationToggle,
        accessibilityOptions: { ...serverSettings.accessibilityOptions },
        themeTokens: { ...serverSettings.themeTokens },
        enabledSections: serverSettings.enabledSections ? { ...serverSettings.enabledSections } : {
          about: true,
          skills: true,
          projects: true,
          blogs: true,
          contact: true,
          journey: true,
          achievements: true,
          resources: true,
          mentorship: true,
          resume: true,
          assistant: true,
          research: true,
        },
      });
    }
  }, [serverSettings, adminForm]);

  const updateMutation = useMutation({
    mutationFn: async (payload: SettingsData) => api.put("/settings", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["global-settings"] });
      setSuccess("Global settings updated successfully.");
      setError(null);
      setTimeout(() => setSuccess(null), 3500);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Failed to update settings.");
    },
  });

  const handleLocalToggle = (key: keyof LocalPreferences) => {
    setLocalPrefs((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      saveLocalPrefs(updated);
      return updated;
    });
  };

  const handleAdminSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminForm) return;
    updateMutation.mutate(adminForm);
  };

  if (isLoading) {
    return <LoadingState message="LOADING_CONFIGURATION_MATRIX..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in duration-500 font-mono text-sm">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-h2 font-bold text-text-primary flex items-center gap-2 font-display">
          <Settings size={20} className="text-accent-analytics" /> Settings
        </h1>
        <p className="text-xs text-text-muted mt-1">// Configure your local dashboard coordinates and preferences</p>
      </div>

      {/* ── LOCAL VISITOR PREFERENCES ── */}
      <section className="space-y-5">
        <h2 className="text-xs font-bold text-accent-analytics uppercase tracking-widest border-b border-divider pb-2">
          // Your Local Preferences
        </h2>
        <p className="text-[11px] text-text-muted">
          These configurations are preserved in your local browser sandbox and do not modify database properties.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <ToggleCard
            icon={<Monitor size={16} />}
            label="Dark Mode"
            description="Toggle dark/light system backgrounds"
            enabled={localPrefs.darkMode}
            onToggle={() => handleLocalToggle("darkMode")}
          />
          <ToggleCard
            icon={<Volume2 size={16} />}
            label="Sound Effects"
            description="Enable UI click and hover synthesizer blips"
            enabled={localPrefs.soundEnabled}
            onToggle={() => handleLocalToggle("soundEnabled")}
          />
          <ToggleCard
            icon={<Sparkles size={16} />}
            label="Animations"
            description="Micro-animations and three-dimensional rotation effects"
            enabled={localPrefs.animationsEnabled}
            onToggle={() => handleLocalToggle("animationsEnabled")}
          />
          <ToggleCard
            icon={<Eye size={16} />}
            label="High Contrast"
            description="Enforce accessibility high contrast limits"
            enabled={localPrefs.highContrast}
            onToggle={() => handleLocalToggle("highContrast")}
          />
        </div>
      </section>

      {/* ── ADMIN: SERVER-SIDE DEFAULTS ── */}
      {isAdmin && adminForm && (
        <section className="space-y-6 border-t border-border pt-8 animate-in slide-in-from-bottom-4 duration-300">
          <div className="space-y-1">
            <h2 className="text-xs font-bold text-accent-finance uppercase tracking-widest">
              // Admin Global Defaults
            </h2>
            <p className="text-[11px] text-text-muted">
              Configure system defaults initialized for all new incoming guest coordinates.
            </p>
          </div>

          {success && (
            <div className="flex items-center gap-2 bg-success/10 border border-success/20 text-success text-xs rounded-xl p-4">
              <CheckCircle size={15} /> {success}
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 bg-error/10 border border-error/20 text-error text-xs rounded-xl p-4">
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleAdminSave} className="space-y-6">
            {/* Toggles */}
            <div className="grid sm:grid-cols-2 gap-4">
              <ToggleCard
                icon={<Monitor size={16} />}
                label="Dark Mode Default"
                description="Default background for new visitors"
                enabled={adminForm.darkModeDefault}
                onToggle={() => setAdminForm({ ...adminForm, darkModeDefault: !adminForm.darkModeDefault })}
                variant="finance"
              />
              <ToggleCard
                icon={<Volume2 size={16} />}
                label="Sound Default"
                description="Default sound active flag"
                enabled={adminForm.soundToggle}
                onToggle={() => setAdminForm({ ...adminForm, soundToggle: !adminForm.soundToggle })}
                variant="finance"
              />
              <ToggleCard
                icon={<Sparkles size={16} />}
                label="Animation Default"
                description="Default animation active flag"
                enabled={adminForm.animationToggle}
                onToggle={() => setAdminForm({ ...adminForm, animationToggle: !adminForm.animationToggle })}
                variant="finance"
              />
              <ToggleCard
                icon={<Eye size={16} />}
                label="High Contrast Default"
                description="Default accessibility parameters"
                enabled={adminForm.accessibilityOptions.highContrast}
                onToggle={() =>
                  setAdminForm({
                    ...adminForm,
                    accessibilityOptions: {
                      ...adminForm.accessibilityOptions,
                      highContrast: !adminForm.accessibilityOptions.highContrast,
                    },
                  })
                }
                variant="finance"
              />
            </div>

            {/* Language + Theme tokens */}
            <div className="grid sm:grid-cols-3 gap-6 bg-bg-surface border border-border p-6 rounded-2xl shadow-md">
              <div className="space-y-1.5">
                <FormLabel htmlFor="language">Language</FormLabel>
                <FormInput
                  id="language"
                  type="text"
                  value={adminForm.language}
                  onChange={(e) => setAdminForm({ ...adminForm, language: e.target.value })}
                />
              </div>
              
              <div className="space-y-1.5">
                <FormLabel htmlFor="primaryColor">Primary Color</FormLabel>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="primaryColorPicker"
                    value={adminForm.themeTokens.primaryColor}
                    onChange={(e) =>
                      setAdminForm({
                        ...adminForm,
                        themeTokens: { ...adminForm.themeTokens, primaryColor: e.target.value },
                      })
                    }
                    className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent"
                  />
                  <FormInput
                    id="primaryColor"
                    type="text"
                    value={adminForm.themeTokens.primaryColor}
                    onChange={(e) =>
                      setAdminForm({
                        ...adminForm,
                        themeTokens: { ...adminForm.themeTokens, primaryColor: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <FormLabel htmlFor="secondaryColor">Secondary Color</FormLabel>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="secondaryColorPicker"
                    value={adminForm.themeTokens.secondaryColor}
                    onChange={(e) =>
                      setAdminForm({
                        ...adminForm,
                        themeTokens: { ...adminForm.themeTokens, secondaryColor: e.target.value },
                      })
                    }
                    className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent"
                  />
                  <FormInput
                    id="secondaryColor"
                    type="text"
                    value={adminForm.themeTokens.secondaryColor}
                    onChange={(e) =>
                      setAdminForm({
                        ...adminForm,
                        themeTokens: { ...adminForm.themeTokens, secondaryColor: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Section Visibility toggles */}
            <div className="space-y-4 pt-6 border-t border-border/60">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-accent-ai uppercase tracking-wider">
                  // Section Visibility Controls
                </h3>
                <p className="text-[11px] text-text-muted">
                  Temporarily enable or disable main portfolio content coordinates on the public layout.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.keys(adminForm.enabledSections || {}).map((sec) => (
                  <ToggleCard
                    key={sec}
                    icon={<Cpu size={16} />}
                    label={`${sec.toUpperCase()}`}
                    description={`Control visibility of the ${sec} section`}
                    enabled={adminForm.enabledSections[sec]}
                    onToggle={() => {
                      const updated = {
                        ...adminForm.enabledSections,
                        [sec]: !adminForm.enabledSections[sec],
                      };
                      setAdminForm({ ...adminForm, enabledSections: updated });
                    }}
                    variant="analytics"
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={updateMutation.isPending}
              icon={<Save size={13} />}
              className="w-full bg-accent-finance hover:bg-accent-finance/90 text-bg-base border-accent-finance/10"
            >
              {updateMutation.isPending ? "COMMITTING CHANGES..." : "COMMIT GLOBAL DEFAULTS"}
            </Button>
          </form>

          {/* ── ADMIN SECURITY & CREDENTIALS ── */}
          <div className="space-y-4 pt-8 border-t border-border/60">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-accent-terracotta uppercase tracking-wider">
                // Admin Login Credentials
              </h3>
              <p className="text-[11px] text-text-muted">
                Update the admin access email and password used to sign into this dashboard.
              </p>
            </div>

            <AdminCredentialsForm />
          </div>
        </section>
      )}
    </div>
  );
}

function AdminCredentialsForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSaving(true);
    try {
      await api.post("/auth/change-credentials", { email, password });
      setSuccess("Login credentials updated successfully!");
      setTimeout(() => setSuccess(null), 3500);
    } catch {
      /* ignore */
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="bg-bg-surface border border-border p-6 rounded-2xl space-y-4 shadow-md">
      {success && (
        <div className="flex items-center gap-2 bg-success/10 border border-success/20 text-success text-xs rounded-xl p-3">
          <CheckCircle size={14} /> {success}
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <FormLabel htmlFor="newAdminEmail">New Admin Email</FormLabel>
          <FormInput
            id="newAdminEmail"
            type="email"
            placeholder="e.g. admin@portfolio.dev"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <FormLabel htmlFor="newAdminPassword">New Password</FormLabel>
          <FormInput
            id="newAdminPassword"
            type="password"
            placeholder="New secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>
      <Button
        type="submit"
        disabled={isSaving}
        icon={<Save size={13} />}
        className="w-full bg-accent-terracotta hover:bg-accent-terracotta/90 text-white"
      >
        {isSaving ? "SAVING..." : "UPDATE LOGIN CREDENTIALS"}
      </Button>
    </form>
  );
}

// ── Toggle Card Sub-component ──
function ToggleCard({
  icon,
  label,
  description,
  enabled,
  onToggle,
  variant = "analytics",
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  variant?: "analytics" | "finance";
}) {
  const activeBorder = variant === "finance" 
    ? "border-accent-finance/25 hover:border-accent-finance/40" 
    : "border-accent-analytics/25 hover:border-accent-analytics/40";
    
  const activeText = variant === "finance" 
    ? "text-accent-finance" 
    : "text-accent-analytics";
    
  const activeBg = variant === "finance" 
    ? "bg-accent-finance" 
    : "bg-accent-analytics";

  return (
    <div
      onClick={onToggle}
      className={`bg-bg-surface border rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all duration-300 select-none shadow-md ${
        enabled ? activeBorder : "border-border hover:border-text-muted/30"
      }`}
    >
      <div className={`${enabled ? activeText : "text-text-muted"} transition-colors`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-text-primary">{label}</p>
        <p className="text-[10px] text-text-muted truncate mt-0.5">{description}</p>
      </div>
      {/* Toggle pill */}
      <div
        className={`w-9 h-5 rounded-full relative transition-colors ${
          enabled ? activeBg : "bg-bg-elevated border border-border"
        }`}
      >
        <div
          className={`absolute top-[1px] w-4 h-4 rounded-full bg-text-primary shadow transition-transform ${
            enabled ? "left-[17px]" : "left-[1px]"
          }`}
        />
      </div>
    </div>
  );
}
