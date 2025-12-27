#### 19.5.1.31 Modo SQL do Servidor e Replicação

Usar diferentes configurações do modo SQL do servidor na fonte e na replica pode fazer com que as mesmas instruções `INSERT` sejam tratadas de maneira diferente na fonte e na replica, levando à divergência entre elas. Para obter os melhores resultados, você deve sempre usar o mesmo modo SQL do servidor na fonte e na replica. Esse conselho se aplica se você estiver usando a replicação baseada em instruções ou baseada em linhas.

Se você estiver replicando tabelas particionadas, usar diferentes modos SQL do servidor na fonte e na replica provavelmente causará problemas. No mínimo, isso provavelmente causará a distribuição de dados entre as partições a ser diferente nas cópias da fonte e da replica de uma determinada tabela. Também pode causar inserções em tabelas particionadas que têm sucesso na fonte, mas falham na replica.

Para obter mais informações, consulte a Seção 7.1.11, “Modos SQL do Servidor”.