"use client";

import { useState } from "react";
import { Plus, Trash2, Edit, Check, X, Key, Users, Save, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Permission = {
  category: string;
  permissions: string[];
};

type Role = {
  id: number;
  name: string;
  description: string;
  permissions: string[];
};

export default function RolesPermissionsPage() {
  // Sample roles data
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 1,
      name: "System Admin",
      description: "Full access to all ERP modules and settings",
      permissions: ["all"],
    },
    {
      id: 2,
      name: "Finance Manager",
      description: "Access to accounting, invoicing, and financial reports",
      permissions: ["finance:view", "finance:edit", "reports:financial"],
    },
    {
      id: 3,
      name: "Inventory Supervisor",
      description: "Manage inventory, purchase orders, and suppliers",
      permissions: ["inventory:view", "inventory:edit", "purchasing:view", "purchasing:edit"],
    },
  ]);

  const [selectedRole, setSelectedRole] = useState<Role>(roles[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);
  const [newRole, setNewRole] = useState<Omit<Role, "id">>({
    name: "",
    description: "",
    permissions: [],
  });

  // ERP System Permissions Structure
  const allPermissions: Permission[] = [
    {
      category: "Dashboard",
      permissions: ["dashboard:view"],
    },
    {
      category: "Finance",
      permissions: ["finance:view", "finance:edit", "finance:approve"],
    },
    {
      category: "Inventory",
      permissions: ["inventory:view", "inventory:edit", "inventory:audit"],
    },
    {
      category: "Purchasing",
      permissions: ["purchasing:view", "purchasing:edit", "purchasing:approve"],
    },
    {
      category: "System",
      permissions: ["system:settings", "system:users", "system:roles"],
    },
  ];

  const togglePermission = (permission: string) => {
    if (selectedRole.permissions.includes("all")) {
      return;
    }

    const updatedPermissions = selectedRole.permissions.includes(permission)
      ? selectedRole.permissions.filter((p) => p !== permission)
      : [...selectedRole.permissions, permission];

    setSelectedRole({
      ...selectedRole,
      permissions: updatedPermissions,
    });
  };

  const toggleAllPermissions = () => {
    setSelectedRole({
      ...selectedRole,
      permissions: selectedRole.permissions.includes("all") ? [] : ["all"],
    });
  };

  const saveRoleChanges = () => {
    const updatedRoles = roles.map((role) =>
      role.id === selectedRole.id ? selectedRole : role
    );
    setRoles(updatedRoles);
    setIsEditing(false);
    toast.success("Role updated successfully", {
      description: `${selectedRole.name} permissions have been saved.`,
    });
  };

  const addNewRole = () => {
    const roleWithId = {
      ...newRole,
      id: Math.max(...roles.map((r) => r.id)) + 1,
    };
    setRoles([...roles, roleWithId]);
    setSelectedRole(roleWithId);
    setNewRole({ name: "", description: "", permissions: [] });
    setShowAddRole(false);
    toast.success("Role created successfully", {
      description: `${roleWithId.name} has been added to the system.`,
    });
  };

  const deleteRole = (id: number) => {
    if (roles.length <= 1) return;
    const roleToDelete = roles.find(role => role.id === id);
    const updatedRoles = roles.filter((role) => role.id !== id);
    setRoles(updatedRoles);
    if (selectedRole.id === id) {
      setSelectedRole(updatedRoles[0]);
    }
    toast.success("Role deleted", {
      description: `${roleToDelete?.name} has been removed from the system.`,
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-gray-900 to-gray-950 overflow-hidden">
      {/* Sidebar - Roles List */}
      <motion.div 
        className="w-72 border-r border-gray-700/50 p-4 flex flex-col bg-gray-800/30 backdrop-blur-sm"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center text-white">
            <Users className="mr-2 h-4 w-4 text-blue-400" /> Roles
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAddRole(true)}
            className="hover:bg-gray-800/50 transition-colors text-gray-300"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Role
          </Button>
        </motion.div>

        <motion.div variants={itemVariants} className="flex-1 overflow-hidden">
          <div className="h-full space-y-2 overflow-y-auto no-scrollbar">
            {roles.map((role) => (
              <motion.div 
                key={role.id}
                variants={itemVariants}
                className={cn(
                  "p-4 rounded-lg cursor-pointer transition-colors border",
                  selectedRole.id === role.id
                    ? "bg-indigo-500/10 border-indigo-500/50"
                    : "bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50"
                )}
                onClick={() => {
                  setSelectedRole(role);
                  setIsEditing(false);
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-medium text-white">{role.name}</h3>
                    <p className="text-xs text-gray-400 line-clamp-1">
                      {role.description}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="iconSm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                      }}
                      className="hover:bg-gray-700/50 text-gray-300"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    {role.id !== 1 && (
                      <Button
                        variant="ghost"
                        size="iconSm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteRole(role.id);
                        }}
                        className="hover:bg-gray-700/50 text-rose-500 hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content Area */}
      <motion.div 
        className="flex-1 p-6 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {showAddRole ? (
          <motion.div 
            variants={itemVariants}
            className="h-full bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
          >
            <div className="p-5 border-b border-gray-700/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-indigo-400" />
                  <h2 className="text-xl font-semibold text-white">Add New Role</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddRole(false)}
                  className="hover:bg-gray-800/50 text-gray-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-5 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role-name" className="text-gray-300">Role Name*</Label>
                <Input
                  id="role-name"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
                  }
                  placeholder="e.g. Warehouse Manager"
                  className="bg-gray-800/50 border-gray-700 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role-description" className="text-gray-300">Description</Label>
                <Textarea
                  id="role-description"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                  placeholder="Describe the role's purpose and access level"
                  className="bg-gray-800/50 border-gray-700 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                />
              </div>

              <Separator className="my-4 bg-gray-700/50" />

              <div className="space-y-4">
                <Label className="text-gray-300">Permissions</Label>
                <Accordion type="multiple" className="w-full">
                  {allPermissions.map((group) => (
                    <AccordionItem 
                      key={group.category} 
                      value={group.category} 
                      className="border-gray-700/50"
                    >
                      <AccordionTrigger className="text-gray-300 hover:no-underline hover:bg-gray-800/50 px-4 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                          <span>{group.category}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-2 px-4 pt-2">
                        {group.permissions.map((permission) => (
                          <div
                            key={permission}
                            className="flex items-center space-x-2"
                          >
                            <Switch
                              id={permission}
                              checked={newRole.permissions.includes(permission)}
                              onCheckedChange={() => {
                                const updatedPermissions =
                                  newRole.permissions.includes(permission)
                                    ? newRole.permissions.filter(
                                        (p) => p !== permission
                                      )
                                    : [...newRole.permissions, permission];
                                setNewRole({
                                  ...newRole,
                                  permissions: updatedPermissions,
                                });
                              }}
                              className="data-[state=checked]:bg-indigo-500"
                            />
                            <Label htmlFor={permission} className="text-sm text-gray-300">
                              {permission
                                .split(":")[1]
                                .charAt(0)
                                .toUpperCase() +
                                permission.split(":")[1].slice(1)}
                            </Label>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>

            <div className="p-5 border-t border-gray-700/50 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddRole(false)}
                className="border-gray-700 hover:bg-gray-800/50 text-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={addNewRole}
                disabled={!newRole.name.trim()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                Create Role
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            variants={itemVariants}
            className="h-full bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden flex flex-col"
          >
            <div className="p-5 border-b border-gray-700/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Key className="h-5 w-5 text-indigo-400" />
                  <h2 className="text-xl font-semibold text-white">{selectedRole.name}</h2>
                </div>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                      className="border-gray-700 hover:bg-gray-800/50 text-gray-300"
                    >
                      <X className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={saveRoleChanges} 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    disabled={selectedRole.id === 1}
                    className="border-gray-700 hover:bg-gray-800/50 text-gray-300"
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                )}
              </div>
              <p className="text-gray-400 mt-1">{selectedRole.description}</p>
            </div>

            <Separator className="bg-gray-700/50" />

            <div className="p-5 flex-1 overflow-auto">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-white">Permissions</h3>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      <Switch
                        id="all-permissions"
                        checked={selectedRole.permissions.includes("all")}
                        onCheckedChange={toggleAllPermissions}
                        className="data-[state=checked]:bg-indigo-500"
                      />
                      <Label htmlFor="all-permissions" className="font-medium text-white">
                        Full System Access (Super Admin)
                      </Label>
                    </div>

                    {selectedRole.permissions.includes("all") ? (
                      <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/30">
                        This role has full access to all system features and
                        cannot be modified.
                      </div>
                    ) : (
                      <Accordion type="multiple" className="w-full">
                        {allPermissions.map((group) => (
                          <AccordionItem 
                            key={group.category} 
                            value={group.category} 
                            className="border-gray-700/50"
                          >
                            <AccordionTrigger className="text-gray-300 hover:no-underline hover:bg-gray-800/50 px-4 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                <span>{group.category}</span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-2 px-4 pt-2">
                              {group.permissions.map((permission) => (
                                <div
                                  key={permission}
                                  className="flex items-center space-x-2"
                                >
                                  <Switch
                                    id={`edit-${permission}`}
                                    checked={selectedRole.permissions.includes(
                                      permission
                                    )}
                                    onCheckedChange={() =>
                                      togglePermission(permission)
                                    }
                                    className="data-[state=checked]:bg-indigo-500"
                                  />
                                  <Label
                                    htmlFor={`edit-${permission}`}
                                    className="text-sm text-gray-300"
                                  >
                                    {permission
                                      .split(":")[1]
                                      .charAt(0)
                                      .toUpperCase() +
                                      permission.split(":")[1].slice(1)}
                                  </Label>
                                </div>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedRole.permissions.includes("all") ? (
                      <Badge className="bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30">
                        Full system access
                      </Badge>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {allPermissions
                          .filter((group) =>
                            group.permissions.some((p) =>
                              selectedRole.permissions.includes(p)
                            )
                          )
                          .map((group) => (
                            <div 
                              key={group.category} 
                              className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-4"
                            >
                              <h4 className="text-sm font-medium text-white mb-3">
                                {group.category}
                              </h4>
                              <ul className="space-y-2">
                                {group.permissions
                                  .filter((p) =>
                                    selectedRole.permissions.includes(p)
                                  )
                                  .map((permission) => (
                                    <li
                                      key={permission}
                                      className="flex items-center"
                                    >
                                      <Check className="h-4 w-4 text-emerald-500 mr-2" />
                                      <span className="text-sm text-gray-300">
                                        {permission
                                          .split(":")[1]
                                          .charAt(0)
                                          .toUpperCase() +
                                          permission.split(":")[1].slice(1)}
                                      </span>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}