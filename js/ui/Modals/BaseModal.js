/**
 * Класс BaseModal.
 * Используется как базовый класс всплывающего окна
 */
class BaseModal {
  constructor( element ) {
    if (element) {
      this.element = element

    } else {
      throw new Error()
    }
  }

  /**
   * Открывает всплывающее окно
   */
  open() {
    this.element.modal('show')
  }

  /**
   * Закрывает всплывающее окно
   */
  close() {
    this.element.modal('hide')
  }
}