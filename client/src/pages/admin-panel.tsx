import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Shield, Users, ArrowLeft } from "lucide-react";
import type { User } from "@shared/schema";

export default function AdminPanel() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  if (user?.role !== "superadmin") {
    return (
      <div className="min-h-screen bg-night-forest flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-deep-pine border-forest-floor">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 text-ember mx-auto mb-4" />
            <CardTitle className="text-birch">Access Denied</CardTitle>
            <CardDescription className="text-sage/80">
              You need super admin privileges to access this area.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setLocation("/")} 
              className="w-full bg-birch text-night-forest hover:bg-birch/90"
              data-testid="button-go-home"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night-forest">
      <div className="max-w-6xl mx-auto p-4 pb-24">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setLocation("/")}
            className="text-sage hover:text-birch"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-cormorant text-birch tracking-wider">Super Admin</h1>
            <p className="text-sage/70 text-sm">Manage users and roles</p>
          </div>
        </div>

        <UsersTab />
      </div>
    </div>
  );
}

function UsersTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!res.ok) throw new Error("Failed to update role");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Role updated" });
    },
  });

  if (usersLoading) {
    return <div className="text-sage text-center py-8">Loading users...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-5 h-5 text-birch" />
        <h2 className="text-lg text-birch">User Management</h2>
      </div>
      
      <ScrollArea className="h-[600px]">
        <div className="space-y-3">
          {users?.map((user) => (
            <Card key={user.id} className="bg-deep-pine border-forest-floor">
              <CardContent className="p-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-birch font-medium">{user.name || user.username || "Unknown"}</p>
                      <p className="text-sage/70 text-sm">{user.email}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        user.role === "superadmin" ? "text-ember border-ember" :
                        user.role === "coach" ? "text-birch border-birch" :
                        "text-sage border-sage"
                      }
                    >
                      {user.role}
                    </Badge>
                  </div>
                  
                  <div>
                    <Label className="text-sage/70 text-xs">Role</Label>
                    <Select
                      value={user.role || "client"}
                      onValueChange={(role) => updateRoleMutation.mutate({ userId: user.id, role })}
                    >
                      <SelectTrigger className="bg-night-forest border-forest-floor text-birch" data-testid={`select-role-${user.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-deep-pine border-forest-floor">
                        <SelectItem value="client">Warrior (Client)</SelectItem>
                        <SelectItem value="coach">Guide (Coach)</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="superadmin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
