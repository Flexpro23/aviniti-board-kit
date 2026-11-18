(() => {
  // Starter chapter: one screen with a state row and a flow strip. Replace with the project's first chapter (see PAGES.md).
  const S11 = ({ empty }) => {
    const C = useC(); const { $, tr } = useL();
    return <PhoneApp title={$('الرئيسية', 'Home')} active="home">
      {empty ? <Card pad={0}><Empty title={$('لا شيء هنا بعد', 'Nothing here yet')} body={$('ستظهر العناصر هنا حين تضيف أولها.', 'Items show up here once you add the first one.')} action={<Btn icon="plus">{$('إضافة', 'Add')}</Btn>} /></Card>
        : <Card pad={0}>{FX.items.map((it, i) => <LRow key={it.id} lead={<IconTile n="file" tone="primary" />} title={tr(it.name)} trail={<Money v={it.amount} />} sub={<StatusPill kind="item" s={it.s} size="sm" />} divider={i < FX.items.length - 1} chev />)}</Card>}
    </PhoneApp>;
  };
  const Ch1 = () => <ChapterBand num={1} name="Start" nameAr="البداية" screens={1} layout="phone"
      title="A title that states a decision." lede="One sentence on what the user gets in this chapter." lane="Why the chapter is structured this way.">
    <ScreenFrame id="1.1" name="Home" nameAr="الرئيسية" device="phone" v="v1" callouts={[{ x: '50%', y: '20%', text: 'Tapping a row opens the item.' }]}><S11 /></ScreenFrame>
    <StateRow of="1.1" device="phone" items={[{ label: 'Empty', el: <S11 empty /> }]} />
    <FlowStrip name="Start" steps={['1.1 Home']} />
  </ChapterBand>;
  window.BOARD_PARTS.B1 = { ...(window.BOARD_PARTS.B1 || {}), 1: Ch1 };
})();
