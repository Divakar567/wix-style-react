export const semicontrolled = `
class ColorInputWithState extends React.Component {
  constructor() {
    super();
    this.state = { 
      confirmed: '#FF0000',
      cancelled: '',
      preview: '', 
    };
    this.confirm = this.confirm.bind(this);
    this.cancel = this.cancel.bind(this);
    this.preview = this.preview.bind(this);
  }

  confirm(confirmed) {this.setState({ confirmed })}
  cancel(cancel) { this.setState({ cancel }) }
  preview(preview) {this.setState({preview})}

  render() {
    const { confirmed, cancelled, preview } = this.state;
    const height = { height: '36px', width: '36px' }
    const viewer = () => { backgroundColor: value }
    return (
      <Layout>
      <Cell >
        <ColorInput 
              value={confirmed} 
              onConfirm={this.confirm}
              onCancel={this.cancel}
              onPreview={this.preview} 
        />
      </Cell>
      <Cell>
        <Layout cols={2} gap={0}>
          <div>Confirmed:</div>
          <div style={{ backgroundColor: confirmed, ...height  }} />
        </Layout>
      </Cell>
      <Cell>
        <Layout cols={2} gap={0}>
          <div>Cancelled:</div>
          <div style={{ backgroundColor: cancelled, ...height  }} />
        </Layout>
      </Cell>
      <Cell>
        <Layout cols={2} gap={0}>
          <div>Picker preview:</div>
          <div style={{ backgroundColor: preview, ...height  }} />
        </Layout>
      </Cell>
      </Layout>
    );
  }
}
`;
