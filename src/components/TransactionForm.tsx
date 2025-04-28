// import { useState } from 'react';
// import { toast } from 'sonner';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


// export default function TransactionForm({ onTransactionAdded, transactionToEdit = null }) {
//   const [formData, setFormData] = useState({
//     amount: transactionToEdit?.amount || '',
//     description: transactionToEdit?.description || '',
//     date: transactionToEdit?.date ? new Date(transactionToEdit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
//   });
  
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState({});

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.amount) newErrors.amount = 'Amount is required';
//     if (isNaN(Number(formData.amount))) newErrors.amount = 'Amount must be a number';
//     if (!formData.description) newErrors.description = 'Description is required';
//     if (!formData.date) newErrors.date = 'Date is required';
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;
    
//     setIsSubmitting(true);
    
//     try {
//       const url = transactionToEdit 
//         ? `/api/transactions/${transactionToEdit._id}` 
//         : '/api/transactions';
      
//       const method = transactionToEdit ? 'PUT' : 'POST';
      
//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
      
//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Something went wrong');
//       }
      
//       // Fix: Use the same toast format as in TransactionList
//       toast(transactionToEdit ? 'Transaction Updated' : 'Transaction Added', {
//         description: `Successfully ${transactionToEdit ? 'updated' : 'added'} the transaction`
//       });
      
//       onTransactionAdded(data.data);
      
//       if (!transactionToEdit) {
//         // Reset form if adding new transaction
//         setFormData({
//           amount: '',
//           description: '',
//           date: new Date().toISOString().split('T')[0],
//         });
//       }
//     } catch (error) {
//       // Already using correct format here
//       toast('Error', {
//         description: error.message,
//         variant: 'destructive'
//       });
//     } finally {
//       setIsSubmitting(false); // Fix: This should be false, not true
//     }
//   };

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle>{transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="amount">Amount</Label>
//             <Input
//               id="amount"
//               name="amount"
//               type="number"
//               step="0.01"
//               value={formData.amount}
//               onChange={handleChange}
//               placeholder="Enter amount"
//               disabled={isSubmitting}
//             />
//             {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="description">Description</Label>
//             <Input
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="Enter description"
//               disabled={isSubmitting}
//             />
//             {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
//           </div>
          
//           <div className="space-y-2">
//             <Label htmlFor="date">Date</Label>
//             <Input
//               id="date"
//               name="date"
//               type="date"
//               value={formData.date}
//               onChange={handleChange}
//               disabled={isSubmitting}
//             />
//             {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
//           </div>
          
//           <Button type="submit" disabled={isSubmitting}>
//             {isSubmitting ? 'Submitting...' : transactionToEdit ? 'Update Transaction' : 'Add Transaction'}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormErrors {
  amount?: string;
  description?: string;
  date?: string;
}

export default function TransactionForm({ onTransactionAdded, transactionToEdit = null }) {
  const [formData, setFormData] = useState({
    amount: transactionToEdit?.amount || '',
    description: transactionToEdit?.description || '',
    date: transactionToEdit?.date ? new Date(transactionToEdit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({}); // Explicitly type the errors state

  const validateForm = () => {
    const newErrors: FormErrors = {}; // Explicitly type newErrors

    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (isNaN(Number(formData.amount))) newErrors.amount = 'Amount must be a number';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const url = transactionToEdit
        ? `/api/transactions/${transactionToEdit._id}`
        : '/api/transactions';

      const method = transactionToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      toast(transactionToEdit ? 'Transaction Updated' : 'Transaction Added', {
        description: `Successfully ${transactionToEdit ? 'updated' : 'added'} the transaction`
      });

      onTransactionAdded(data.data);

      if (!transactionToEdit) {
        setFormData({
          amount: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
        });
      }
    } catch (error) {
      toast.error('Error', {
        description: error.message,
      });
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              disabled={isSubmitting}
            />
            {errors.amount && <p className="text-sm text-red-500">{errors.amount}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              disabled={isSubmitting}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : transactionToEdit ? 'Update Transaction' : 'Add Transaction'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}