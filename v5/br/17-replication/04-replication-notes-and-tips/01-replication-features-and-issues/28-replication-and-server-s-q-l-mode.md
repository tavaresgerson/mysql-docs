#### 16.4.1.28 Modo de replicação e servidor SQL

Usar diferentes configurações de modo SQL do servidor na fonte e na replica pode fazer com que as mesmas instruções de inserção sejam tratadas de maneira diferente na fonte e na replica, levando à divergência entre elas. Para obter os melhores resultados, você deve sempre usar o mesmo modo SQL do servidor na fonte e na replica. Esse conselho se aplica se você estiver usando replicação baseada em instruções ou baseada em linhas.

Se você estiver replicando tabelas particionadas, usar diferentes modos SQL na fonte e na replica provavelmente causará problemas. No mínimo, isso provavelmente fará com que a distribuição dos dados entre as partições seja diferente nas cópias da fonte e da replica de uma determinada tabela. Isso também pode fazer com que as inserções em tabelas particionadas que tenham sucesso na fonte falhem na replica.

Para obter mais informações, consulte Seção 5.1.10, “Modos SQL do Servidor”. Em particular, consulte Alterações no Modo SQL no MySQL 5.7, que descreve as alterações no MySQL 5.7, para que você possa avaliar se suas aplicações estão afetadas.
