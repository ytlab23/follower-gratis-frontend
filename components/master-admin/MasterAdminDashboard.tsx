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
import { AdminProfile } from '../../types/admin';

interface MasterAdminDashboardProps {
  onRefresh?: () => void;
}

export function MasterAdminDashboard({ onRefresh }: MasterAdminDashboardProps) {
  const [error, setError] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminProfile | null>(null);

  const {
    admins,
    stats,
    isLoading,
    updateStatus,
    deleteAdmin,
    refreshData,
  } = useMasterAdminApi();

  const handleStatusUpdate = async (admin: AdminProfile, isActive: boolean) => {
    try {
      setError('');
      await updateStatus.mutateAsync({
        id: admin.id,
        data: { isActive, isBanned: false },
      });
      onRefresh?.();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;

    try {
      setError('');
      await deleteAdmin.mutateAsync(selectedAdmin.id);
      setDeleteDialogOpen(false);
      setSelectedAdmin(null);
      onRefresh?.();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete admin');
    }
  };

  const openDeleteDialog = (admin: AdminProfile) => {
    setSelectedAdmin(admin);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading admins...</div>
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
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
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

      {/* Admins Table */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Management</CardTitle>
          <CardDescription>
            Manage all admin accounts and their status
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
              {admins?.map((admin: any) => (
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
                    <Badge variant={admin.adminProfile?.isPaid ? "default" : "secondary"} className={
                      admin.adminProfile?.isPaid ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }>
                      {admin.adminProfile?.isPaid ? 'Paid' : 'Unpaid'}
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
                          onClick={() => handleStatusUpdate(admin as AdminProfile, !admin.isActive)}
                          disabled={updateStatus.isPending}
                        >
                          {admin.isActive ? 'Deactivate' : 'Activate'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(admin as AdminProfile)}
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

          {admins?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No admins found
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Admin</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedAdmin?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteAdmin.isPending}
            >
              {deleteAdmin.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
