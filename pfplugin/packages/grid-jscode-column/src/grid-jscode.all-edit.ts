import { GridRowState } from '@ibiz-template/runtime';
import { computed, reactive, Ref } from 'vue';
import { GridJsCodeColumnController } from './grid-jscode-column.controller';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function useAllEdit(
  props: {
    readonly row: GridRowState;
    readonly controller: GridJsCodeColumnController;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _componentRef: Ref<any>,
) {
  const c = props.controller;

  // * 表格列相关
  /** 列的禁用状态 */
  const disabled = computed(() => {
    return props.row.editColStates[c.fieldName].disabled;
  });
  /** 列的只读状态 */
  const readonly = computed(() => {
    return props.row.editColStates[c.fieldName].readonly;
  });
  /** 列是否有错误信息 */
  // const hasError = computed(() => !!props.row.errors[c.fieldName]);
  /** 列的编辑状态 */
  const editable = computed(() => props.controller.grid.state.rowEditOpen);

  const editorReadOnly = computed(() => {
    // 非只读的时候，编辑关闭且没有报错的时候才显示只读
    return readonly.value || !editable.value;
  });
  const editorDisabled = computed(() => {
    return editable.value && disabled.value;
  });

  /** 是否阻止内部点击冒泡 */
  const stopPropagation = computed(() => {
    return editable.value;
  });

  const onBlur = (): void => {
    if (c.enableSave) {
      c.grid.save(props.row.data);
    }
  };

  const gridEditItemProps = reactive({
    stopPropagation,
  });

  const editorProps = reactive({
    disabled: editorDisabled,
    readonly: editorReadOnly,
    onBlur,
  });

  return {
    gridEditItemProps,
    editorProps,
  };
}
