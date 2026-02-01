import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Check,
  X,
  Star,
  Users,
  Zap,
  Shield,
  BarChart3,
  Clock,
  Headphones,
  ArrowRight,
  Crown,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small teams getting started",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      popular: false,
      pricing: {
        monthly: 9,
        yearly: 90,
      },
      features: {
        users: "Up to 10 users",
        projects: "5 projects",
        storage: "10GB storage",
        support: "Email support",
        analytics: "Basic analytics",
        integrations: "5 integrations",
        customization: false,
        priority: false,
        advanced: false,
        sla: false,
      },
      included: [
        "Task management",
        "Team collaboration",
        "Basic reporting",
        "Mobile app access",
        "Email notifications",
        "Standard security",
      ],
      notIncluded: [
        "Advanced analytics",
        "Priority support",
        "Custom workflows",
        "API access",
        "SSO integration",
        "Advanced security",
      ],
    },
    {
      name: "Professional",
      description: "Ideal for growing teams and businesses",
      icon: Zap,
      color: "from-purple-500 to-pink-500",
      popular: true,
      pricing: {
        monthly: 19,
        yearly: 190,
      },
      features: {
        users: "Up to 50 users",
        projects: "Unlimited projects",
        storage: "100GB storage",
        support: "Priority support",
        analytics: "Advanced analytics",
        integrations: "25 integrations",
        customization: true,
        priority: true,
        advanced: true,
        sla: false,
      },
      included: [
        "Everything in Starter",
        "Advanced task automation",
        "Custom workflows",
        "Time tracking",
        "Advanced reporting",
        "API access",
        "Priority email support",
        "Team performance insights",
        "Custom fields",
        "Bulk operations",
      ],
      notIncluded: [
        "Dedicated account manager",
        "99.9% SLA guarantee",
        "Advanced security compliance",
        "Custom integrations",
      ],
    },
    {
      name: "Enterprise",
      description: "For large organizations with advanced needs",
      icon: Crown,
      color: "from-amber-500 to-orange-500",
      popular: false,
      pricing: {
        monthly: 49,
        yearly: 490,
      },
      features: {
        users: "Unlimited users",
        projects: "Unlimited projects",
        storage: "1TB storage",
        support: "24/7 phone & chat",
        analytics: "Enterprise analytics",
        integrations: "Unlimited integrations",
        customization: true,
        priority: true,
        advanced: true,
        sla: true,
      },
      included: [
        "Everything in Professional",
        "Dedicated account manager",
        "99.9% SLA guarantee",
        "Advanced security & compliance",
        "Custom integrations",
        "On-premise deployment option",
        "Advanced user permissions",
        "Audit logs",
        "Custom branding",
        "Training & onboarding",
        "24/7 phone support",
        "Priority feature requests",
      ],
      notIncluded: [],
    },
  ];

  const features = [
    {
      category: "Core Features",
      items: [
        { name: "Task Management", starter: true, pro: true, enterprise: true },
        { name: "Team Collaboration", starter: true, pro: true, enterprise: true },
        { name: "Project Organization", starter: "5 projects", pro: "Unlimited", enterprise: "Unlimited" },
        { name: "Mobile App", starter: true, pro: true, enterprise: true },
        { name: "Email Notifications", starter: true, pro: true, enterprise: true },
      ],
    },
    {
      category: "Advanced Features",
      items: [
        { name: "Time Tracking", starter: false, pro: true, enterprise: true },
        { name: "Custom Workflows", starter: false, pro: true, enterprise: true },
        { name: "Advanced Analytics", starter: false, pro: true, enterprise: true },
        { name: "API Access", starter: false, pro: true, enterprise: true },
        { name: "Bulk Operations", starter: false, pro: true, enterprise: true },
      ],
    },
    {
      category: "Enterprise Features",
      items: [
        { name: "SSO Integration", starter: false, pro: false, enterprise: true },
        { name: "Advanced Security", starter: false, pro: false, enterprise: true },
        { name: "Audit Logs", starter: false, pro: false, enterprise: true },
        { name: "Custom Branding", starter: false, pro: false, enterprise: true },
        { name: "On-premise Deployment", starter: false, pro: false, enterprise: true },
      ],
    },
  ];

  const getPrice = (plan: typeof plans[0]) => {
    const price = plan.pricing[billingCycle];
    const yearlyDiscount = billingCycle === "yearly" ? Math.round(((plan.pricing.monthly * 12 - plan.pricing.yearly) / (plan.pricing.monthly * 12)) * 100) : 0;
    return { price, yearlyDiscount };
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-orb-gradient opacity-20 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-mesh-gradient opacity-15 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="absolute inset-0 bg-grid-overlay opacity-10" />
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="mr-2 h-4 w-4" />
            Pricing Plans
          </Badge>
          <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Scale your team's productivity with TaskSphere. From startups to enterprises, 
            we have the right plan to accelerate your success.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1 rounded-full border border-border/60 bg-background/50">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all",
                billingCycle === "monthly"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all relative",
                billingCycle === "yearly"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Yearly
              <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                Save 20%
              </Badge>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-3 mb-16">
          {plans.map((plan, index) => {
            const { price, yearlyDiscount } = getPrice(plan);
            const Icon = plan.icon;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative rounded-3xl border p-8 shadow-brand-soft transition-all duration-300 hover:shadow-brand-strong",
                  plan.popular
                    ? "border-primary/50 bg-primary/5 scale-105"
                    : "border-border/70 bg-background/80"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Star className="mr-1 h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="mb-6">
                  <div className={cn("inline-flex p-3 rounded-2xl bg-gradient-to-r mb-4", plan.color)}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-foreground">${price}</span>
                    <span className="text-muted-foreground">
                      /{billingCycle === "monthly" ? "month" : "year"}
                    </span>
                  </div>
                  {billingCycle === "yearly" && yearlyDiscount > 0 && (
                    <p className="text-sm text-green-600 font-medium">
                      Save {yearlyDiscount}% with yearly billing
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">per user</p>
                </div>

                <Button
                  className={cn(
                    "w-full mb-8",
                    plan.popular
                      ? "bg-mesh-gradient text-primary-foreground shadow-brand-soft hover:shadow-brand-strong"
                      : "border-border/60"
                  )}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">What's included:</h4>
                  <ul className="space-y-3">
                    {plan.included.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.notIncluded.length > 0 && (
                    <>
                      <h4 className="font-semibold text-foreground pt-4">Not included:</h4>
                      <ul className="space-y-3">
                        {plan.notIncluded.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <X className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl border border-border/70 bg-background/80 p-8 shadow-brand-soft mb-16"
        >
          <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-8">
            Compare All Features
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="text-left py-4 px-6 font-semibold text-foreground">Features</th>
                  <th className="text-center py-4 px-6 font-semibold text-foreground">Starter</th>
                  <th className="text-center py-4 px-6 font-semibold text-foreground">Professional</th>
                  <th className="text-center py-4 px-6 font-semibold text-foreground">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {features.map((category) => (
                  <>
                    <tr key={category.category}>
                      <td colSpan={4} className="py-6 px-6">
                        <h3 className="font-semibold text-foreground text-lg">{category.category}</h3>
                      </td>
                    </tr>
                    {category.items.map((item) => (
                      <tr key={item.name} className="border-b border-border/30">
                        <td className="py-3 px-6 text-muted-foreground">{item.name}</td>
                        <td className="py-3 px-6 text-center">
                          {typeof item.starter === "boolean" ? (
                            item.starter ? (
                              <Check className="h-4 w-4 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-muted-foreground">{item.starter}</span>
                          )}
                        </td>
                        <td className="py-3 px-6 text-center">
                          {typeof item.pro === "boolean" ? (
                            item.pro ? (
                              <Check className="h-4 w-4 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-muted-foreground">{item.pro}</span>
                          )}
                        </td>
                        <td className="py-3 px-6 text-center">
                          {typeof item.enterprise === "boolean" ? (
                            item.enterprise ? (
                              <Check className="h-4 w-4 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground mx-auto" />
                            )
                          ) : (
                            <span className="text-sm text-muted-foreground">{item.enterprise}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl font-bold text-foreground mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-border/60 bg-background/50 p-6">
              <h3 className="font-semibold text-foreground mb-2">Can I change plans anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/50 p-6">
              <h3 className="font-semibold text-foreground mb-2">Is there a free trial?</h3>
              <p className="text-sm text-muted-foreground">
                We offer a 14-day free trial for all plans. No credit card required to start.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/50 p-6">
              <h3 className="font-semibold text-foreground mb-2">What payment methods do you accept?</h3>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/50 p-6">
              <h3 className="font-semibold text-foreground mb-2">Do you offer discounts for nonprofits?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, we offer 50% discounts for qualified nonprofit organizations and educational institutions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center rounded-3xl border border-border/70 bg-gradient-to-r from-primary/10 to-accent/10 p-12"
        >
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
            Ready to Transform Your Team's Productivity?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of teams already using TaskSphere to streamline their workflow and achieve more together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-mesh-gradient text-primary-foreground shadow-brand-soft hover:shadow-brand-strong">
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-border/60" asChild>
              <Link to="/contact">
                <Headphones className="mr-2 h-4 w-4" />
                Talk to Sales
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;