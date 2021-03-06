import { shallow } from 'enzyme';
import { viewFunction as LayoutView } from '../layout';
import { DateTableRow as Row } from '../../../base/date_table/row';
import { DayDateTableCell as Cell } from '../cell';
import { getKeyByDateAndGroup } from '../../../utils';

jest.mock('../../../base/date_table/row', () => ({
  ...require.requireActual('../../../base/date_table/row'),
  Row: () => null,
}));
jest.mock('../cell', () => ({
  DayDateTableCell: () => null,
}));
jest.mock('../../../utils', () => ({
  getKeyByDateAndGroup: jest.fn(),
}));

describe('DayDateTableLayout', () => {
  describe('Render', () => {
    const viewCellsData = {
      groupedData: [{
        dateTable: [
          [{ startDate: new Date(2020, 6, 9, 0), endDate: new Date(2020, 6, 9, 0, 30), groups: 1 }],
          [{ startDate: new Date(2020, 6, 9, 0, 30), endDate: new Date(2020, 6, 9, 1), groups: 2 }],
        ],
      }],
    };
    const render = (viewModel) => shallow(LayoutView({
      ...viewModel,
      props: { ...viewModel.props, viewCellsData },
    } as any) as any);

    afterEach(() => jest.resetAllMocks());

    it('should spread restAttributes', () => {
      const layout = render({ restAttributes: { customAttribute: 'customAttribute' } });

      expect(layout.prop('customAttribute'))
        .toBe('customAttribute');
    });

    it('should render components correctly', () => {
      const layout = render({});

      expect(layout.find('table').exists())
        .toBe(true);
      expect(layout.find('tbody').exists())
        .toBe(true);

      const rows = layout.find(Row);

      expect(rows)
        .toHaveLength(2);
    });

    it('should render cells and pass correct props to them', () => {
      const layout = render({});

      const cells = layout.find(Cell);
      expect(cells)
        .toHaveLength(2);

      expect(cells.at(0).props())
        .toMatchObject({
          startDate: viewCellsData.groupedData[0].dateTable[0][0].startDate,
          endDate: viewCellsData.groupedData[0].dateTable[0][0].endDate,
          groups: viewCellsData.groupedData[0].dateTable[0][0].groups,
        });

      expect(cells.at(1).props())
        .toMatchObject({
          startDate: viewCellsData.groupedData[0].dateTable[1][0].startDate,
          endDate: viewCellsData.groupedData[0].dateTable[1][0].endDate,
          groups: viewCellsData.groupedData[0].dateTable[1][0].groups,
        });
    });

    it('should call getKeyByDateAndGroup with correct parameters', () => {
      render({});

      expect(getKeyByDateAndGroup)
        .toHaveBeenCalledTimes(4);

      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          1, viewCellsData.groupedData[0].dateTable[0][0].startDate,
          viewCellsData.groupedData[0].dateTable[0][0].groups,
        );
      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          2, viewCellsData.groupedData[0].dateTable[0][0].startDate,
          viewCellsData.groupedData[0].dateTable[0][0].groups,
        );
      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          3, viewCellsData.groupedData[0].dateTable[1][0].startDate,
          viewCellsData.groupedData[0].dateTable[1][0].groups,
        );
      expect(getKeyByDateAndGroup)
        .toHaveBeenNthCalledWith(
          4, viewCellsData.groupedData[0].dateTable[1][0].startDate,
          viewCellsData.groupedData[0].dateTable[1][0].groups,
        );
    });
  });
});
