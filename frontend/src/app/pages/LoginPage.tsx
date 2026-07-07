import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Leaf,
  MessageCircle,
  Package,
  ShoppingBasket,
  Sprout,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import agrivoLogo from "../../assets/agrivo-logo.png";
import authIllustration from "../../assets/agrivo-auth-illustration.png";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Checkbox } from "../components/ui/checkbox";
import { Separator } from "../components/ui/separator";
import { cn } from "../components/ui/utils";
import { useAuth } from "../auth/AuthContext";
import { DEMO_LOGIN_HINTS } from "../auth/demoUsers";
import { getDashboardHashForRole } from "../auth/authService";

type UserRole = "buyer" | "farmer" | "logistics";

const roleOptions: Array<{
  id: UserRole;
  label: string;
  description: string;
  icon: LucideIcon;
  iconTint: string;
}> = [
  {
    id: "buyer",
    label: "Buyer",
    description: "Browse products and place orders from verified farmers.",
    icon: ShoppingBasket,
    iconTint: "text-[#1f8d4b]",
  },
  {
    id: "farmer",
    label: "Farmer",
    description: "List your products and connect with buyers.",
    icon: Sprout,
    iconTint: "text-[#43A047]",
  },
  {
    id: "logistics",
    label: "Logistics Partner",
    description: "Manage deliveries and order handoffs.",
    icon: Truck,
    iconTint: "text-[#14532D]",
  },
];

const authStats: Array<{ value: string; label: string; icon: LucideIcon; iconTint: string }> = [
  { value: "100+", label: "Farmers", icon: Users, iconTint: "text-[#1f8d4b]" },
  { value: "1000+", label: "Orders", icon: Package, iconTint: "text-[#14532D]" },
  { value: "50+", label: "Product Types", icon: Leaf, iconTint: "text-[#43A047]" },
];

const rolePreview: Array<{ label: string; text: string; icon: LucideIcon }> = [
  { label: "Buyer", text: "Order fresh products", icon: ShoppingBasket },
  { label: "Farmer", text: "Sell your harvest", icon: Sprout },
  { label: "Logistics", text: "Deliver with ease", icon: Truck },
];

type AuthTab = "login" | "register";

function getAuthTabFromHash(): AuthTab {
  const hash = window.location.hash.replace("#", "");
  return hash === "register" ? "register" : "login";
}

export default function LoginPage() {
  const { login, register, isAuthenticated, user } = useAuth();
  const [authTab, setAuthTab] = useState<AuthTab>(getAuthTabFromHash);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "buyer" as UserRole,
    agreeTerms: false,
  });

  const selectedRole = roleOptions.find((role) => role.id === registerForm.userType);

  useEffect(() => {
    if (isAuthenticated && user) {
      window.location.hash = getDashboardHashForRole(user.role);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const syncTabFromHash = () => {
      setAuthTab(getAuthTabFromHash());
    };

    syncTabFromHash();
    window.addEventListener("hashchange", syncTabFromHash);
    return () => window.removeEventListener("hashchange", syncTabFromHash);
  }, []);

  const handleAuthTabChange = (value: string) => {
    const tab = value as AuthTab;
    setAuthTab(tab);
    if (window.location.hash.replace("#", "") !== tab) {
      window.location.hash = tab;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsSubmitting(true);

    const result = await login(loginForm.email, loginForm.password);
    setIsSubmitting(false);

    if (!result.success) {
      setLoginError(result.error);
      return;
    }

    window.location.hash = getDashboardHashForRole(result.user.role);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setIsSubmitting(true);

    const result = await register({
      name: registerForm.name,
      email: registerForm.email,
      phone: registerForm.phone,
      password: registerForm.password,
      confirmPassword: registerForm.confirmPassword,
      role: registerForm.userType,
      agreeTerms: registerForm.agreeTerms,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setRegisterError(result.error);
      return;
    }

    window.location.hash = getDashboardHashForRole(result.user.role);
  };

  const fillDemoLogin = (email: string, password: string) => {
    setLoginForm({ email, password, rememberMe: false });
    setLoginError("");
    setAuthTab("login");
    if (window.location.hash.replace("#", "") !== "login") {
      window.location.hash = "login";
    }
  };

  const handleWhatsAppLogin = () => {
    const message = encodeURIComponent("Hi! I'd like to login to Agrivo marketplace via WhatsApp.");
    window.open(`https://wa.me/919876543200?text=${message}`, "_blank");
  };

  const handleBackToHome = () => {
    window.location.hash = "home";
  };

  const inputClassName = "auth-input w-full";

  return (
    <div className="agrivo-shell agrivo-auth-page flex min-h-screen items-center justify-center">
      <Leaf
        className="auth-decor-leaf auth-decor-leaf--one pointer-events-none absolute text-[#43A047]"
        strokeWidth={1.25}
        aria-hidden
      />
      <Leaf
        className="auth-decor-leaf auth-decor-leaf--two pointer-events-none absolute text-[#14532D]"
        strokeWidth={1.25}
        aria-hidden
      />
      <Button
        variant="ghost"
        className="absolute left-4 top-4 z-10 text-[#5F6F64] hover:bg-[#EAF7EC] hover:text-[#14532D]"
        onClick={handleBackToHome}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      <div className="auth-layout">
        <div className="auth-brand-card">
          <div className="auth-brand-image">
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#14532D]/14 via-transparent to-transparent" />
            <div className="auth-brand-badge">
              <p className="text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-[#14532D]">
                Farm to Market
              </p>
              <p className="mt-0.5 text-[0.625rem] leading-4 text-[#5F6F64]">
                Fresh products from verified farmers
              </p>
            </div>
            <img
              src={authIllustration}
              alt="Farmers and buyers connecting through fresh produce at an Agrivo marketplace"
              decoding="async"
            />
          </div>

          <div className="auth-brand-body">
            <div className="auth-brand-copy">
              <h2 className="auth-brand-headline agrivo-heading">
                Fresh food. <span className="text-[#14532D]">Direct from farmers.</span>
              </h2>
              <p className="auth-brand-description">
                Buy, sell, and deliver local products in one trusted platform.
              </p>
            </div>

            <div className="auth-stat-grid">
              {authStats.map((stat) => {
                const StatIcon = stat.icon;
                return (
                  <div key={stat.label} className="auth-stat-card">
                    <div className="auth-stat-icon">
                      <StatIcon className={cn("auth-stat-icon-svg", stat.iconTint)} strokeWidth={2} />
                    </div>
                    <p className="auth-stat-value">{stat.value}</p>
                    <p className="auth-stat-label">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="auth-role-row">
              {rolePreview.map((role) => {
                const RoleIcon = role.icon;
                return (
                  <div key={role.label} className="auth-role-pill">
                    <div className="auth-role-pill-icon">
                      <RoleIcon className="auth-role-pill-icon-svg text-[#2E7D32]" strokeWidth={2} />
                    </div>
                    <p className="auth-role-pill-label">{role.label}</p>
                    <p className="auth-role-pill-text">{role.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="auth-form-panel">
          <Card className="auth-form-card overflow-hidden">
            <CardHeader className="space-y-1 px-6 pb-0 pt-6 text-center">
              <div className="auth-logo">
                <img src={agrivoLogo} alt="Agrivo" />
              </div>
              <CardTitle className="text-xl font-semibold text-[#102018]">
                {authTab === "register" ? "Create Account" : "Welcome Back"}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-4">
              <Tabs value={authTab} onValueChange={handleAuthTabChange} className="w-full">
                <TabsList className="auth-tabs-list mb-5">
                  <TabsTrigger value="login" className="auth-tabs-trigger">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="register" className="auth-tabs-trigger">
                    Register
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="mt-0">
                  <form onSubmit={handleLogin} className="space-y-3">
                    {loginError ? (
                      <p className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-xs text-[#b91c1c]">
                        {loginError}
                      </p>
                    ) : null}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[#102018]">Email</label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        className={inputClassName}
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[#102018]">Password</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          className={cn(inputClassName, "pr-10")}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 h-auto -translate-y-1/2 p-1"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-0.5">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={loginForm.rememberMe}
                          onCheckedChange={(checked) =>
                            setLoginForm({ ...loginForm, rememberMe: checked as boolean })
                          }
                        />
                        <label htmlFor="remember" className="text-xs text-[#5F6F64]">
                          Remember me
                        </label>
                      </div>
                      <a href="#" className="text-xs text-[#14532D] hover:text-[#1D6A3B]">
                        Forgot password?
                      </a>
                    </div>
                    <Button type="submit" className="auth-submit-btn w-full text-white" disabled={isSubmitting}>
                      {isSubmitting ? "Logging in..." : "Login"}
                    </Button>

                    <div className="rounded-xl border border-dashed border-[#dbe7d4] bg-[#f8faf4] px-3 py-3">
                      <p className="text-xs font-semibold text-[#14532D]">Demo accounts</p>
                      <div className="mt-2 space-y-1.5">
                        {DEMO_LOGIN_HINTS.map((demo) => (
                          <button
                            key={demo.email}
                            type="button"
                            className="block w-full text-left text-[0.6875rem] leading-5 text-[#5F6F64] transition hover:text-[#14532D]"
                            onClick={() => fillDemoLogin(demo.email, demo.password)}
                          >
                            {demo.role === "buyer" ? "Buyer" : demo.role === "farmer" ? "Farmer" : "Logistics"}:{" "}
                            {demo.email} / {demo.password}
                          </button>
                        ))}
                      </div>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="mt-0">
                  <form onSubmit={handleRegister} className="space-y-3">
                    {registerError ? (
                      <p className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-xs text-[#b91c1c]">
                        {registerError}
                      </p>
                    ) : null}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-[#102018]">Full Name</label>
                        <Input
                          placeholder="Your name"
                          value={registerForm.name}
                          onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                          className={inputClassName}
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-[#102018]">Phone</label>
                        <Input
                          placeholder="+994 XX XXX XX XX"
                          value={registerForm.phone}
                          onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                          className={inputClassName}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-[#102018]">Email</label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        className={inputClassName}
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#102018]">I am a</label>
                      <div className="auth-role-select">
                        {roleOptions.map((role) => {
                          const Icon = role.icon;
                          const isSelected = registerForm.userType === role.id;
                          const shortLabel =
                            role.id === "logistics" ? "Logistics" : role.label;
                          return (
                            <button
                              key={role.id}
                              type="button"
                              onClick={() => setRegisterForm({ ...registerForm, userType: role.id })}
                              className={cn(
                                "auth-role-select-btn",
                                isSelected && "auth-role-select-btn--active",
                              )}
                            >
                              <div className="auth-role-select-icon">
                                <Icon
                                  className={cn(
                                    "h-4 w-4",
                                    isSelected ? "text-white" : role.iconTint,
                                  )}
                                  strokeWidth={2}
                                />
                              </div>
                              <span className="text-xs font-semibold leading-tight">{shortLabel}</span>
                            </button>
                          );
                        })}
                      </div>
                      {selectedRole ? (
                        <p className="mt-1.5 text-xs leading-5 text-[#5F6F64]">
                          {selectedRole.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-[#102018]">Password</label>
                        <Input
                          type="password"
                          placeholder="Create password"
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                          className={inputClassName}
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-[#102018]">Confirm</label>
                        <Input
                          type="password"
                          placeholder="Confirm password"
                          value={registerForm.confirmPassword}
                          onChange={(e) =>
                            setRegisterForm({ ...registerForm, confirmPassword: e.target.value })
                          }
                          className={inputClassName}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={registerForm.agreeTerms}
                        onCheckedChange={(checked) =>
                          setRegisterForm({ ...registerForm, agreeTerms: checked as boolean })
                        }
                        required
                      />
                      <label htmlFor="terms" className="text-xs leading-5 text-[#5F6F64]">
                        I agree to the{" "}
                        <a href="#" className="text-[#14532D] hover:text-[#1D6A3B]">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-[#14532D] hover:text-[#1D6A3B]">
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                    <Button
                      type="submit"
                      className="auth-submit-btn w-full text-white"
                      disabled={!registerForm.agreeTerms || isSubmitting}
                    >
                      {isSubmitting ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-4">
                <Separator className="my-3 bg-[#e5efe1]" />
                <Button
                  variant="outline"
                  className="auth-whatsapp-btn w-full"
                  onClick={handleWhatsAppLogin}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Quick Login via WhatsApp
                </Button>
              </div>

              <p className="mt-3 text-center text-[0.6875rem] leading-5 text-[#5F6F64]">
                Need help? Contact Agrivo support via WhatsApp at +91-9876543200
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
