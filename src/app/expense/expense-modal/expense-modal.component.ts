import { Component, Input } from '@angular/core';
import {ModalController, RefresherCustomEvent} from '@ionic/angular';
import {filter, finalize, from} from 'rxjs';
import { CategoryModalComponent } from '../../category/category-modal/category-modal.component';
import { ActionSheetService } from '../../shared/service/action-sheet.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {save} from "ionicons/icons";
import {CategoryService} from "../../category/category.service";
import {ExpenseService} from "../expense.service";
import {formatISO, parseISO } from 'date-fns';
import {Category, CategoryCriteria} from "../../shared/domain";
import {ToastService} from "../../shared/service/toast.service";

@Component({
  selector: 'app-expense-modal',
  templateUrl: './expense-modal.component.html',
})
export class ExpenseModalComponent {
  categories: Category[] = [];
  readonly expenseForm: FormGroup;
  submitting = false;
  readonly initialSort = 'name,asc';
  lastPageReached = false;
  loading = false;
  searchCriteria: CategoryCriteria = { page: 0, size: 25, sort: this.initialSort };
  reloadCategories($event?: any): void {
    this.searchCriteria.page = 0;
    this.loadCategories(() => ($event ? ($event as RefresherCustomEvent).target.complete() : {}));
  }


  constructor(
    private readonly expenseService: ExpenseService,
    private readonly categoryService: CategoryService,
    private readonly actionSheetService: ActionSheetService,
    private readonly modalCtrl: ModalController,
    private readonly formBuilder: FormBuilder,
    private readonly toastService: ToastService,
) {
  this.expenseForm = this.formBuilder.group({
    id: [],
    amount:[],
    categoryId:[],
    date:[],
    name: ['', [Validators.required, Validators.maxLength(40)]],
  });
}

  private loadCategories(next: () => void = () => {}): void {
    if (!this.searchCriteria.name) delete this.searchCriteria.name;
    this.loading = true;
    this.categoryService
      .getCategories(this.searchCriteria)
      .pipe(
        finalize(() => {
          this.loading = false;
          next();
        }),
      )
      .subscribe({
        next: (categories) => {
          if (this.searchCriteria.page === 0 || !this.categories) this.categories = [];
          this.categories.push(...categories.content);
          this.lastPageReached = categories.last;
        },
        error: (error) => this.toastService.displayErrorToast('Could not load categories', error),
      });
  }
  cancel(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save(): void {
    this.submitting = true;
    this.expenseService
      .upsertExpense({
        ...this.expenseForm.value,
        date: formatISO(parseISO(this.expenseForm.value.date), { representation: 'date' }),
      });
  }

  delete(): void {
    from(this.actionSheetService.showDeletionConfirmation('Are you sure you want to delete this expense?'))
      .pipe(filter((action) => action === 'delete'))
      .subscribe(() => this.modalCtrl.dismiss(null, 'delete'));
  }
  private loadAllCategories(): void {
    this.categoryService.getAllCategories({ sort: 'name,asc' }).subscribe({
      next: (categories) => (this.categories = categories),
      error: (error) => this.toastService.displayErrorToast('Could not load categories', error),
    });
  }

  async showCategoryModal(): Promise<void> {
    const categoryModal = await this.modalCtrl.create({ component: CategoryModalComponent });
    categoryModal.present();
    const { role } = await categoryModal.onWillDismiss();
    console.log('role', role);
  }
  ionViewWillEnter(): void {
    this.loadAllCategories();
  }
}
