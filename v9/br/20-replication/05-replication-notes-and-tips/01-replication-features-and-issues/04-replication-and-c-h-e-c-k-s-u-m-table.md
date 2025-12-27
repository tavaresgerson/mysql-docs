#### 19.5.1.4 Replicação e CHECKSUM TABLE

O `CHECKSUM TABLE` retorna um checksum calculado linha por linha, usando um método que depende do formato de armazenamento da linha da tabela. O formato de armazenamento não é garantido para permanecer o mesmo entre as versões do MySQL, portanto, o valor do checksum pode mudar após uma atualização.