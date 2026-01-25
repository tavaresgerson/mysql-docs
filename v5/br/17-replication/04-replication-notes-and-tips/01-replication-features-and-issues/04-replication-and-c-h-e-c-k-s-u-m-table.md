#### 16.4.1.4 Replicação e CHECKSUM TABLE

[`CHECKSUM TABLE`](checksum-table.html "13.7.2.3 CHECKSUM TABLE Statement") retorna um checksum que é calculado linha por linha, usando um método que depende do formato de armazenamento de row da table. Não há garantia de que o formato de armazenamento permaneça o mesmo entre as versões do MySQL, portanto, o valor do checksum pode mudar após um upgrade.