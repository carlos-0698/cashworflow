import { Transaction } from "@/components/TransactionForm";
import { addMonths, addWeeks, addDays, addYears, format, isBefore, isAfter, startOfMonth, endOfMonth, parseISO } from "date-fns";

export interface InstallmentTransaction extends Transaction {
  displayAmount: number;
}

export function generateInstallments(
  transaction: Omit<Transaction, "id">,
  transactionId: string
): Omit<Transaction, "id">[] {
  const installments: Omit<Transaction, "id">[] = [];
  const totalInstallments = transaction.installments || 1;
  const installmentAmount = transaction.amount / totalInstallments;
  const baseDate = parseISO(transaction.date);

  for (let i = 0; i < totalInstallments; i++) {
    const installmentDate = addMonths(baseDate, i);

    installments.push({
      ...transaction,
      amount: installmentAmount,
      currentInstallment: i + 1,
      parentTransactionId: i === 0 ? undefined : transactionId,
      date: format(installmentDate, "yyyy-MM-dd"),
    });
  }

  return installments;
}

export function generateRecurringTransactions(
  transaction: Omit<Transaction, "id">,
  untilDate: Date
): Omit<Transaction, "id">[] {
  if (!transaction.isRecurring || !transaction.recurrenceFrequency) {
    return [transaction];
  }

  const recurring: Omit<Transaction, "id">[] = [];
  const baseDate = parseISO(transaction.date);
  const endDate = transaction.recurrenceEndDate
    ? parseISO(transaction.recurrenceEndDate)
    : untilDate;

  let currentDate = baseDate;

  while (isBefore(currentDate, endDate) || currentDate.getTime() === endDate.getTime()) {
    if (!isBefore(currentDate, baseDate)) {
      recurring.push({
        ...transaction,
        date: format(currentDate, "yyyy-MM-dd"),
      });
    }

    switch (transaction.recurrenceFrequency) {
      case "daily":
        currentDate = addDays(currentDate, 1);
        break;
      case "weekly":
        currentDate = addWeeks(currentDate, 1);
        break;
      case "monthly":
        currentDate = addMonths(currentDate, 1);
        break;
      case "yearly":
        currentDate = addYears(currentDate, 1);
        break;
    }

    if (isAfter(currentDate, untilDate)) {
      break;
    }
  }

  return recurring;
}

export function getMonthTransactions(
  allTransactions: Transaction[],
  year: number,
  month: number
): InstallmentTransaction[] {
  const monthStart = startOfMonth(new Date(year, month - 1, 1));
  const monthEnd = endOfMonth(new Date(year, month - 1, 1));

  return allTransactions
    .filter((transaction) => {
      const transactionDate = parseISO(transaction.date);

      if (transaction.creditCard && transaction.installments && transaction.installments > 1) {
        return (
          transactionDate >= monthStart &&
          transactionDate <= monthEnd
        );
      }

      return (
        transactionDate >= monthStart &&
        transactionDate <= monthEnd
      );
    })
    .map((transaction) => ({
      ...transaction,
      displayAmount: transaction.amount,
    }));
}

export function calculateCreditCardExpensesForMonth(
  transactions: Transaction[],
  year: number,
  month: number
): { [cardName: string]: number } {
  const cardExpenses: { [cardName: string]: number } = {};
  const monthDate = new Date(year, month - 1, 1);

  transactions.forEach((transaction) => {
    if (transaction.creditCard && transaction.type === "despesa") {
      const transactionDate = parseISO(transaction.date);
      const totalInstallments = transaction.installments || 1;
      const installmentAmount = transaction.amount / totalInstallments;

      for (let i = 0; i < totalInstallments; i++) {
        const installmentDate = addMonths(transactionDate, i);

        if (
          installmentDate.getFullYear() === year &&
          installmentDate.getMonth() === month - 1
        ) {
          if (!cardExpenses[transaction.creditCard]) {
            cardExpenses[transaction.creditCard] = 0;
          }
          cardExpenses[transaction.creditCard] += installmentAmount;
        }
      }
    }
  });

  return cardExpenses;
}
