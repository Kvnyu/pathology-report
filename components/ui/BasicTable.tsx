// External modules
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow
} from '@tremor/react';
import cs from 'classnames';

export interface BasicTableColumn<T> {
  label: string;
  renderCell: (data: T) => JSX.Element;
  // The renderCell function takes an EnrichedDiagnosticMetric object and returns JSX
  getKey: (data: T) => string;
}

interface BasicTableProps<T> {
  columns: BasicTableColumn<T>[];
  data: T[];
  name: string;
  className?: string;
}

function BasicTable<T>({ columns, data, name, className }: BasicTableProps<T>) {
  return (
    <div className={cs('mx-auto w-full overflow-x-auto', className)}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableHeaderCell key={`header-${column.label}`}>
                {column.label}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {!!data && data.length > 0 ? (
            data.map((rowData, index) => (
              <TableRow key={`${name}-row-${index}`}>
                {columns.map((column, index) => (
                  <TableCell key={`${column.getKey(rowData)}-${index}`} className="align-top">
                    {column.renderCell(rowData)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>No data</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export { BasicTable };
