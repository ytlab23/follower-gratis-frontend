'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { useMasterAdminApi } from '../../hooks/use-master-admin';
import { ScriptAdminProfile } from '../../types/script-admin';

interface MasterAdminDashboardProps {
  onRefresh?: () => void;
}

export function MasterAdminDashboard({ onRefresh }: MasterAdminDashboardProps) {
  const [error, setError] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedScriptAdmin, setSelectedScriptAdmin] = useState<ScriptAdminProfile | null>(null);

  const {
    scriptAdmins,
    stats,
    isLoading,
    updateStatus,
    deleteScriptAdmin,
    refreshData,
  } = useMasterAdminApi();

  const handleStatusUpdate = async (scriptAdmin: ScriptAdminProfile, isActive: boolean) => {
    try {
      setError('');
      await updateStatus.mutateAsync({
        id: scriptAdmin.id,
        data: { isActive, isBanned: false },
      });
      onRefresh?.();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!selectedScriptAdmin) return;

    try {
      setError('');
      await deleteScriptAdmin.mutateAsync(selectedScriptAdmin.id);
      setDeleteDialogOpen(false);
      setSelectedScriptAdmin(null);
      onRefresh?.();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete script admin');
    }
  };

  const openDeleteDialog = (scriptAdmin: ScriptAdminProfile) => {
    setSelectedScriptAdmin(scriptAdmin);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading script admins...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Script Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.active || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.paid || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Banned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.banned || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Script Admins Table */}
      <Card>
        <CardHeader>
          <CardTitle>Script Admin Management</CardTitle>
          <CardDescription>
            Manage all script admin accounts and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scriptAdmins?.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Badge variant={admin.isActive ? "default" : "secondary"} className={
                        admin.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }>
                        {admin.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      {admin.isBanned && (
                        <Badge variant="destructive">Banned</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={admin.scriptAdminProfile?.isPaid ? "default" : "secondary"} className={
                      admin.scriptAdminProfile?.isPaid ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }>
                      {admin.scriptAdminProfile?.isPaid ? 'Paid' : 'Unpaid'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(admin, !admin.isActive)}
                          disabled={updateStatus.isPending}
                        >
                          {admin.isActive ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(admin as ScriptAdminProfile)}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {scriptAdmins?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No script admins found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Script Admin</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedScriptAdmin?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteScriptAdmin.isPending}
            >
              {deleteScriptAdmin.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
