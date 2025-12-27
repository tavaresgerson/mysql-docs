## A.10 FAQ do MySQL 9.5: NDB Cluster

Na seção a seguir, respondemos a perguntas frequentes sobre o MySQL NDB Cluster e o motor de armazenamento `NDB`.

A.10.1. Quais versões do software MySQL suportam o NDB Cluster? Devo compilar a partir do código-fonte?

A.10.2. O que significam “NDB” e “NDBCLUSTER”?

A.10.3. Qual é a diferença entre usar o NDB Cluster e usar a replicação do MySQL?

A.10.4. Preciso de alguma rede especial para executar o NDB Cluster? Como os computadores em um cluster se comunicam?

A.10.5. Quantas máquinas eu preciso para executar um NDB Cluster e por quê?

A.10.6. O que os diferentes computadores fazem em um NDB Cluster?

A.10.7. Quando executo o comando SHOW no cliente de gerenciamento do NDB Cluster, vejo uma linha de saída que parece assim:

A.10.8. Com quais sistemas operacionais posso usar o NDB Cluster?

A.10.9. Quais são os requisitos de hardware para executar o NDB Cluster?

A.10.10. Quanto RAM eu preciso para usar o NDB Cluster? É possível usar memória de disco?

A.10.11. Quais sistemas de arquivos posso usar com o NDB Cluster? E sistemas de arquivos de rede ou compartilhamentos de rede?

A.10.12. Posso executar nós do NDB Cluster dentro de máquinas virtuais (como as criadas pelo VMWare, VirtualBox, Parallels ou Xen)?

A.10.13. Estou tentando popolar um banco de dados do NDB Cluster. O processo de carregamento termina prematuramente e recebo uma mensagem de erro como esta:

A.10.14. O NDB Cluster usa TCP/IP. Isso significa que posso executá-lo na Internet, com um ou mais nós em locais remotos?

A.10.15. Eu preciso aprender um novo idioma de programação ou consulta para usar o NDB Cluster?

A.10.16. Quais linguagens de programação e APIs são suportadas pelo NDB Cluster?

A.10.17. O NDB Cluster inclui alguma ferramenta de gerenciamento?

A.10.18. Como descobrir o que significa um erro ou mensagem de aviso ao usar o NDB Cluster?

A.10.19. O NDB Cluster é seguro para transações? Quais níveis de isolamento são suportados?

A.10.20. Quais motores de armazenamento são suportados pelo NDB Cluster?

A.10.21. Em caso de falha catastrófica — por exemplo, toda a cidade perde energia e meu UPS falha — eu perderia todos os meus dados?

A.10.22. É possível usar índices FULLTEXT com o NDB Cluster?

A.10.23. Posso executar vários nós em um único computador?

A.10.24. Posso adicionar nós de dados a um NDB Cluster sem reiniciá-lo?

A.10.25. Existem alguma limitação que eu devo estar ciente ao usar o NDB Cluster?

A.10.26. O NDB Cluster suporta chaves estrangeiras?

A.10.27. Como importo um banco de dados MySQL existente para um NDB Cluster?

A.10.28. Como os nós do NDB Cluster se comunicam entre si?

A.10.29. O que é um árbitro?

A.10.30. Quais tipos de dados são suportados pelo NDB Cluster?

A.10.31. Como iniciar e parar o NDB Cluster?

A.10.32. O que acontece com os dados do NDB Cluster quando o cluster é desligado?

A.10.33. É uma boa ideia ter mais de um nó de gerenciamento para um NDB Cluster?

A.10.34. Posso misturar diferentes tipos de hardware e sistemas operacionais em um NDB Cluster?

A.10.35. Posso executar dois nós de dados em um único host? Dois nós SQL?

A.10.36. Posso usar nomes de host com o NDB Cluster?

A.10.37. O NDB Cluster suporta IPv6?

A.10.38. Como lida com usuários MySQL em um NDB Cluster que têm vários servidores MySQL?

A.10.39. Como continuo enviando consultas no caso de um dos nós SQL falhar?

A.10.40. Como faço backup e restauração de um NDB Cluster?

A.10.41. O que é um "processo anjo"?

="top"><p> What does the <span class="quote">“<span class="quote">show nodegroup star</span>”</span> command do? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> The <span class="quote">“<span class="quote">show nodegroup star</span>”</span> command displays the <span class="quote">“<span class="quote">star</span>”</span> of a <span class="quote">“<span class="quote">nodegroup</span>”</span>. A <span class="quote">“<span class="quote">nodegroup</span>”</span> is a collection of <span class="quote">“<span class="quote">nodes</span>”</span> that are managed together. The <span class="quote">“<span class="quote">star</span>”</span> of a <span class="quote">“<span class="quote">nodegroup</span>”</span> is the <span class="quote">“<span class="quote">star</span>”</span> of the <span class="quote">“<span class="quote">management node</span>”</span> in the <span class="quote">“<span class="quote">nodegroup</span>”</span>. </p></td></tr></tbody></table>python




















































































































































































$> ps aux | grep ndb me      23002  0.0  0.0 122948  3104 ?        Ssl  14:14   0:00 ./ndb_mgmd me      23025  0.0  0.0   5284   820 pts/2    S+   14:14   0:00 grep ndb

$> ./ndbd -c 127.0.0.1 --initial

$> ps aux | grep ndb me      23002  0.0  0.0 123080  3356 ?        Ssl  14:14   0:00 ./ndb_mgmd me      23096  0.0  0.0  35876  2036 ?        Ss   14:14   0:00 ./ndbmtd -c 127.0.0.1 --initial me      23097  1.0  2.4 524116 91096 ?        Sl   14:14   0:00 ./ndbmtd -c 127.0.0.1 --initial me      23168  0.0  0.0   5284   812 pts/2    R+   14:15   0:00 grep ndb`</pre><p> O processo <a class="link" href="mysql-cluster-programs-ndbd.html" title="25.5.1 ndbd — The NDB Cluster Data Node Daemon"><span class="command"><strong>ndbd</strong></span></a> mostrando <code class="literal">0.0</code> tanto para uso de memória quanto de CPU é o processo anjo (embora ele realmente use uma quantidade muito pequena de cada). Este processo apenas verifica se o principal <a class="link" href="mysql-cluster-programs-ndbd.html" title="25.5.1 ndbd — The NDB Cluster Data Node Daemon"><span class="command"><strong>ndbd</strong></span></a> ou o processo <a class="link" href="mysql-cluster-programs-ndbmtd.html" title="25.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"><span class="command"><strong>ndbmtd</strong></span></a> (o processo do nó de dados principal que realmente lida com os dados) está em execução. Se permitido (por exemplo, se o parâmetro de configuração <code class="literal">StopOnError</code></code> for definido como <code class="literal">false</code>), o processo anjo tenta reiniciar o processo do nó de dados principal. </p></td></tr></tbody></table>