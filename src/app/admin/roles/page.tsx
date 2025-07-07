// app/roles-permissions/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Settings, 
  Trash2, 
  Edit2, 
  Users, 
  Key, 
  ChevronDown,
  Check,
  X,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

type Permission = {
  id: string;
  name: string;
  description: string;
  category: string;
};

type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  users: number;
  isDefault?: boolean;
};

const permissionCategories = [
  'Administration',
  'Content',
  'Reporting',
  'Settings',
  'User Management'
];

export default function RolesPermissionsPage() {
  // State for roles and permissions
  const [roles, setRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editRole, setEditRole] = useState<Omit<Role, 'id' | 'users' | 'permissions'>>({ 
    name: '', 
    description: '' 
  });
  const [newRole, setNewRole] = useState<Omit<Role, 'id' | 'users' | 'permissions'>>({ 
    name: '', 
    description: '' 
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize with mock data
  useEffect(() => {
    const mockPermissions: Permission[] = [
      { id: 'dashboard', name: 'Dashboard', description: 'Access to main dashboard', category: 'Administration' },
      { id: 'users', name: 'User Management', description: 'Manage system users', category: 'User Management' },
      { id: 'roles', name: 'Role Management', description: 'Manage roles and permissions', category: 'User Management' },
      { id: 'inventory', name: 'Inventory', description: 'Access product inventory', category: 'Content' },
      { id: 'sales', name: 'Sales', description: 'View sales data and reports', category: 'Reporting' },
      { id: 'customers', name: 'Customers', description: 'Manage customer information', category: 'Content' },
      { id: 'reports', name: 'Reports', description: 'Generate and view reports', category: 'Reporting' },
      { id: 'settings', name: 'System Settings', description: 'Configure system settings', category: 'Settings' },
      { id: 'support', name: 'Support', description: 'Access customer support tools', category: 'Content' },
      { id: 'billing', name: 'Billing', description: 'Manage billing and invoices', category: 'Reporting' },
      { id: 'all', name: 'All Permissions', description: 'Full system access', category: 'Administration' },
    ];

    const mockRoles: Role[] = [
      {
        id: '1',
        name: 'Super Admin',
        description: 'Full access to all features and settings',
        permissions: ['all'],
        users: 3,
        isDefault: true
      },
      {
        id: '2',
        name: 'Administrator',
        description: 'Access to most administrative features',
        permissions: ['dashboard', 'users', 'inventory', 'reports', 'settings'],
        users: 12
      },
      {
        id: '3',
        name: 'Manager',
        description: 'Access to inventory and reporting',
        permissions: ['dashboard', 'inventory', 'reports'],
        users: 25
      },
      {
        id: '4',
        name: 'Sales',
        description: 'Access to sales and customer data',
        permissions: ['dashboard', 'sales', 'customers'],
        users: 42
      },
      {
        id: '5',
        name: 'Support',
        description: 'Access to customer support features',
        permissions: ['dashboard', 'support', 'customers'],
        users: 18
      }
    ];

    setAllPermissions(mockPermissions);
    setRoles(mockRoles);
    setIsLoading(false);
  }, []);

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRole = () => {
    if (!newRole.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    if (roles.some(r => r.name.toLowerCase() === newRole.name.toLowerCase())) {
      toast.error('Role with this name already exists');
      return;
    }

    const role: Role = {
      id: Date.now().toString(),
      name: newRole.name,
      description: newRole.description,
      permissions: [],
      users: 0
    };

    setRoles([...roles, role]);
    setSelectedRole(role);
    setNewRole({ name: '', description: '' });
    setShowCreateForm(false);
    toast.success('Role created successfully');
  };

  const handleUpdateRole = () => {
    if (!selectedRole || !editRole.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    if (roles.some(r => 
      r.id !== selectedRole.id && 
      r.name.toLowerCase() === editRole.name.toLowerCase()
    )) {
      toast.error('Role with this name already exists');
      return;
    }

    const updatedRoles = roles.map(role => 
      role.id === selectedRole.id 
        ? { ...role, name: editRole.name, description: editRole.description }
        : role
    );

    setRoles(updatedRoles);
    setSelectedRole({ ...selectedRole, ...editRole });
    setIsEditing(false);
    toast.success('Role updated successfully');
  };

  const handleDeleteRole = (id: string) => {
    const role = roles.find(r => r.id === id);
    if (role?.isDefault) {
      toast.error('Default roles cannot be deleted');
      return;
    }

    setRoles(roles.filter(role => role.id !== id));
    if (selectedRole?.id === id) {
      setSelectedRole(null);
    }
    toast.success('Role deleted successfully');
  };

  const togglePermission = (permissionId: string) => {
    if (!selectedRole) return;
    
    let updatedPermissions: string[];
    
    if (permissionId === 'all') {
      updatedPermissions = selectedRole.permissions.includes('all') 
        ? [] 
        : ['all', ...allPermissions.map(p => p.id)];
    } else {
      updatedPermissions = selectedRole.permissions.includes(permissionId)
        ? selectedRole.permissions.filter(id => id !== permissionId)
        : [...selectedRole.permissions, permissionId];
      
      // If "all" was selected and we're removing one permission, remove "all"
      if (selectedRole.permissions.includes('all') && !updatedPermissions.includes('all')) {
        updatedPermissions = updatedPermissions.filter(id => id !== 'all');
      }
    }

    setHasUnsavedChanges(true);
    const updatedRoles = roles.map(role => 
      role.id === selectedRole.id 
        ? { ...role, permissions: updatedPermissions } 
        : role
    );
    
    setRoles(updatedRoles);
    setSelectedRole({ ...selectedRole, permissions: updatedPermissions });
  };

  const handleSavePermissions = () => {
    if (!selectedRole) return;
    
    // Here you would typically make an API call to save the permissions
    // For now, we'll just show a success message
    toast.success(`Permissions saved for ${selectedRole.name}`, {
      description: `${selectedRole.permissions.length} permissions assigned`,
      action: {
        label: 'View',
        onClick: () => console.log('View permissions', selectedRole.permissions)
      }
    });
    
    setHasUnsavedChanges(false);
  };

  const handleSelectAllCategory = (category: string) => {
    if (!selectedRole) return;
    
    const categoryPermissions = allPermissions
      .filter(p => p.category === category)
      .map(p => p.id);
    
    const allCategorySelected = categoryPermissions.every(p => 
      selectedRole.permissions.includes(p)
    );
    
    const updatedPermissions = allCategorySelected
      ? selectedRole.permissions.filter(id => !categoryPermissions.includes(id))
      : [...new Set([...selectedRole.permissions, ...categoryPermissions])];
    
    // Remove "all" if we're deselecting any permissions
    if (allCategorySelected && updatedPermissions.includes('all')) {
      updatedPermissions.splice(updatedPermissions.indexOf('all'), 1);
    }
    
    setHasUnsavedChanges(true);
    const updatedRoles = roles.map(role => 
      role.id === selectedRole.id 
        ? { ...role, permissions: updatedPermissions } 
        : role
    );
    
    setRoles(updatedRoles);
    setSelectedRole({ ...selectedRole, permissions: updatedPermissions });
  };

  const isCategorySelected = (category: string) => {
    if (!selectedRole) return false;
    const categoryPermissions = allPermissions.filter(p => p.category === category);
    return categoryPermissions.every(p => selectedRole.permissions.includes(p.id));
  };

  const isPermissionSelected = (permissionId: string) => {
    if (!selectedRole) return false;
    return selectedRole.permissions.includes('all') || 
           selectedRole.permissions.includes(permissionId);
  };

  const startEditing = () => {
    if (!selectedRole) return;
    setEditRole({
      name: selectedRole.name,
      description: selectedRole.description
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  return (
    <div className="bg-[#111827] h-screen text-gray-200 p-4 sm:p-8 overflow-scroll no-scrollbar">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Role Management</h1>
            <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
              Create and manage user roles with specific permissions
            </p>
          </div>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto"
            onClick={() => setShowCreateForm(true)}
            disabled={showCreateForm}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Role
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Roles List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search and Create Form */}
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <div className="flex flex-col space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search roles..."
                      className="pl-9 bg-gray-800 border-gray-700 text-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {showCreateForm && (
                    <div className="space-y-3 pt-2">
                      <Input 
                        placeholder="Role name" 
                        className="bg-gray-800 border-gray-700 text-white"
                        value={newRole.name}
                        onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                      />
                      <Input 
                        placeholder="Description" 
                        className="bg-gray-800 border-gray-700 text-white"
                        value={newRole.description}
                        onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                      />
                      <div className="flex space-x-2">
                        <Button 
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                          onClick={handleCreateRole}
                        >
                          Create
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-gray-700"
                          onClick={() => setShowCreateForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Roles Table */}
            <Card className="border-gray-800 bg-gray-900 text-gray-200 w-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Roles</span>
                  <Badge variant="outline" className="border-gray-700 text-gray-200 bg-gray-700">
                    {roles.length} total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                ) : filteredRoles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No roles found
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100vh-420px)] ">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-gray-800">
                          <TableHead className="w-[60%] text-gray-400">Role</TableHead>
                          <TableHead className="text-center text-gray-400">Users</TableHead>
                          <TableHead className="text-right text-gray-400">Actions</TableHead>

                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRoles.map((role) => (
                          <TableRow 
                            key={role.id}
                            className={`border-gray-800 hover:bg-gray-800 cursor-pointer ${
                              selectedRole?.id === role.id ? 'bg-gray-800' : ''
                            }`}
                            onClick={() => {
                              if (hasUnsavedChanges) {
                                toast.warning('You have unsaved changes', {
                                  description: 'Save your changes before switching roles',
                                  action: {
                                    label: 'Save Now',
                                    onClick: handleSavePermissions
                                  }
                                });
                                return;
                              }
                              setSelectedRole(role);
                            }}
                          >
                            <TableCell>
                              <div className="font-medium flex items-center text-white">
                                {role.name}
                                {role.isDefault && (
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-400 mt-1 line-clamp-1">
                                {role.description}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="border-gray-700 text-gray-200 bg-gray-700">
                                <Users className="mr-1 h-3 w-3" /> {role.users}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Settings className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent 
                                  className="bg-gray-800 border-gray-700 w-40"
                                  align="end"
                                >
                                  <DropdownMenuItem 
                                    className="hover:bg-gray-700"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedRole(role);
                                      startEditing();
                                    }}
                                  >
                                    <Edit2 className="mr-2 h-4 w-4" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-400 hover:bg-red-500/10"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteRole(role.id);
                                    }}
                                    disabled={role.isDefault}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Permissions Manager */}
          <div className="lg:col-span-1  overflow-scroll no-scrollbar" >
            <Card className="border-gray-800 bg-gray-900  text-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Key className="h-5 w-5 mr-2" />
                    {selectedRole ? (
                      isEditing ? (
                        <Input
                          className="bg-gray-800 border-gray-700 text-lg font-bold w-auto"
                          value={editRole.name}
                          onChange={(e) => setEditRole({...editRole, name: e.target.value})}
                        />
                      ) : (
                        <span>{selectedRole.name} Permissions</span>
                      )
                    ) : (
                      <span>Select a Role</span>
                    )}
                  </div>
                  {selectedRole && (
                    <div className="flex items-center space-x-2">
                      {isEditing ? (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-gray-700 h-8"
                            onClick={cancelEditing}
                          >
                            <X className="h-4 w-4 mr-1" /> Cancel
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-indigo-600 hover:bg-indigo-700 h-8"
                            onClick={handleUpdateRole}
                          >
                            <Check className="h-4 w-4 mr-1" /> Save
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-gray-700 h-8 bg-gray-700 hover:bg-gray-800 hover:text-gray-300"
                          onClick={startEditing}
                        >
                          <Edit2 className="h-4 w-4 mr-1" /> Edit Role
                        </Button>
                      )}
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedRole ? (
                  <div className="space-y-6">
                    <div>
                      {isEditing ? (
                        <Input
                          placeholder="Role description"
                          className="bg-gray-800 border-gray-700"
                          value={editRole.description}
                          onChange={(e) => setEditRole({...editRole, description: e.target.value})}
                        />
                      ) : (
                        <p className="text-gray-300">{selectedRole.description}</p>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Permissions</h3>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="select-all">Select All</Label>
                        <Switch
                          id="select-all"
                          checked={selectedRole.permissions.includes('all')}
                          onCheckedChange={() => togglePermission('all')}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {permissionCategories.map(category => {
                        const categoryPermissions = allPermissions.filter(
                          p => p.category === category
                        );
                        
                        if (categoryPermissions.length === 0) return null;
                        
                        return (
                          <div key={category} className="border border-gray-800 rounded-lg overflow-hidden">
                            <div className="flex items-center justify-between bg-gray-800/50 p-3">
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  id={`category-${category}`}
                                  checked={isCategorySelected(category)}
                                  onCheckedChange={() => handleSelectAllCategory(category)}
                                  disabled={selectedRole.permissions.includes('all')}
                                />
                                <Label htmlFor={`category-${category}`} className="font-medium">
                                  {category}
                                </Label>
                              </div>
                              <Badge variant="outline" className="border-gray-700 text-gray-200 bg-gray-700">
                                {categoryPermissions.filter(p => 
                                  isPermissionSelected(p.id)
                                ).length}/{categoryPermissions.length}
                              </Badge>
                            </div>
                            <div className="p-3 space-y-2">
                              {categoryPermissions.map(permission => (
                                <div 
                                  key={permission.id}
                                  className="flex items-center space-x-3 p-2 hover:bg-gray-800/30 rounded"
                                >
                                  <Checkbox
                                    id={`perm-${permission.id}`}
                                    checked={isPermissionSelected(permission.id)}
                                    onCheckedChange={() => togglePermission(permission.id)}
                                    disabled={selectedRole.permissions.includes('all')}
                                  />
                                  <div className="flex-1">
                                    <Label htmlFor={`perm-${permission.id}`} className="font-medium block">
                                      {permission.name}
                                    </Label>
                                    <p className="text-sm text-gray-400">
                                      {permission.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <Key className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg">Select a role to manage permissions</p>
                    <p className="text-sm mt-2 text-center max-w-md">
                      Choose a role from the list to view and edit its permissions, or create a new role
                    </p>
                  </div>
                )}
              </CardContent>
              {selectedRole && (
                <CardFooter className="flex justify-between border-t border-gray-800">
                  <div>
                    {hasUnsavedChanges && (
                      <span className="text-sm text-yellow-400 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2 animate-pulse"></span>
                        You have unsaved changes
                      </span>
                    )}
                  </div>
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleSavePermissions}
                    disabled={!hasUnsavedChanges}
                  >
                    <Save className="h-4 w-4 mr-2" /> 
                    Save Permissions
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}