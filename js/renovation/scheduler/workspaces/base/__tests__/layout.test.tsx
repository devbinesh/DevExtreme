import { shallow } from 'enzyme';
import { viewFunction as LayoutView } from '../layout';

describe('LayoutBase', () => {
  describe('Render', () => {
    const headerPanelTemplate = () => null;
    const dateTableTemplate = () => null;
    const viewCellsData = {
      groupedData: [{
        dateTable: [[
          {
            startDate: new Date(2020, 6, 9),
            endDate: new Date(2020, 6, 10),
            today: true,
            groups: 1,
          },
          {
            startDate: new Date(2020, 6, 10),
            endDate: new Date(2020, 6, 11),
            today: false,
            groups: 2,
          },
        ], [
          {
            startDate: new Date(2020, 6, 11),
            endDate: new Date(2020, 6, 12),
            today: false,
            groups: 3,
          },
          {
            startDate: new Date(2020, 6, 12),
            endDate: new Date(2020, 6, 13),
            today: false,
            groups: 4,
          },
        ]],
      }],
    };
    const render = (viewModel) => shallow(LayoutView({
      ...viewModel,
      props: {
        headerPanelTemplate,
        dateTableTemplate,
        viewCellsData,
        ...viewModel.props,
      },
    } as any) as any);

    it('should spread restAttributes', () => {
      const layout = render({ restAttributes: { customAttribute: 'customAttribute' } });

      expect(layout.prop('customAttribute'))
        .toBe('customAttribute');
    });

    it('should render templates', () => {
      const layout = render({});

      const header = layout.find(headerPanelTemplate);
      expect(header.exists())
        .toBe(true);
      expect(header.props())
        .toMatchObject({
          viewCellsData: viewCellsData.groupedData[0].dateTable,
        });

      const dateTable = layout.find(dateTableTemplate);
      expect(dateTable.exists())
        .toBe(true);
      expect(dateTable.props())
        .toMatchObject({ viewCellsData });
    });
  });
});
