#### 19.5.1.30 Modo de replicação e servidor SQL

Usar diferentes configurações de modo SQL do servidor na fonte e na replica pode fazer com que as mesmas instruções `INSERT` sejam tratadas de maneira diferente na fonte e na replica, levando à divergência entre elas. Para obter os melhores resultados, você deve sempre usar o mesmo modo SQL do servidor na fonte e na replica. Esse conselho se aplica se você estiver usando replicação baseada em instruções ou baseada em linhas.

Se você estiver replicando tabelas particionadas, usar diferentes modos SQL na fonte e na replica provavelmente causará problemas. No mínimo, isso provavelmente fará com que a distribuição dos dados entre as partições seja diferente nas cópias da fonte e da replica de uma determinada tabela. Isso também pode fazer com que as inserções em tabelas particionadas que tenham sucesso na fonte falhem na replica.

Para obter mais informações, consulte a Seção 7.1.11, “Modos SQL do servidor”.
