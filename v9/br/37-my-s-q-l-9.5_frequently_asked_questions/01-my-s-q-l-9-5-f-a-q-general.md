## A.1 Perguntas Frequentes do MySQL 9.5: Geral

A.1.1. Qual versão do MySQL está pronta para produção (GA)?

A.1.2. Por que a numeração das versões do MySQL omitiu as versões 6 e 7 e passou diretamente para 8.0?

A.1.3. O MySQL pode fazer subconsultas?

A.1.4. O MySQL pode realizar inserções, atualizações e exclusões em múltiplas tabelas?

A.1.5. O MySQL tem Sequências?

A.1.6. O MySQL tem uma função NOW() com frações de segundo?

A.1.7. O MySQL funciona com processadores multi-core?

A.1.8. Por que vejo vários processos para o mysqld?

A.1.9. O MySQL pode realizar transações ACID?

<table>
  <tr>
    <td border="0" style="width: 100%;"><col span="2"/><col /></td>
    <td><a name="faq-mysql-version-ga"></a><a name="id468406"></a><p><b>A.1.1.</b></p></td>
  </tr>
  <tr>
    <td><td align="left" valign="top"><a name="faq-mysql-version-ga"></a><a name="id468406"></a><p>Qual versão do MySQL está pronta para produção (GA)? </p></td>
    <td><p> As versões 9.5, 8.4 e 8.0 do MySQL estão com suporte ativo para uso em produção. </p>
    <p> A série de inovação do MySQL 9.0.0 foi lançada com o MySQL 9.0.0 em 01 de julho de 2024. </p>
    <p> A série de LTS 8.4 foi lançada com o MySQL 8.4.0 em 30 de abril de 2024. </p>
    <p> A série de inovação do MySQL 8.1.0 foi lançada com o MySQL 8.1.0 em 18 de julho de 2023. O desenvolvimento ativo terminou em 2024-01-16 com o lançamento do MySQL 8.3.0. </p>
    <p> O MySQL 8.0 alcançou o status de General Availability (GA) com o MySQL 8.0.11, que foi lançado para uso em produção em 19 de abril de 2018. Ele se tornou uma série de correções de bugs a partir do MySQL 8.0.34 com a introdução do modelo de lançamento de inovação e LTS <a class="link" href="mysql-releases.html" title="1.3 Releases do MySQL: Inovação e LTS">Inovação e LTS</a>. </p>
    <p> O MySQL 5.7 alcançou o status de General Availability (GA) com o MySQL 5.7.9, que foi lançado para uso em produção em 21 de outubro de 2015. O desenvolvimento ativo para o MySQL 5.7 terminou em 25 de outubro de 2023 com o lançamento do MySQL 5.7.44. </p>
    <p> O MySQL 5.6 alcançou o status de General Availability (GA) com o MySQL 5.6.10, que foi lançado para uso em produção em 5 de fevereiro de 2013. O desenvolvimento ativo para o MySQL 5.6 terminou. </p>
    <p> O MySQL 5.5 alcançou o status de General Availability (GA) com o MySQL 5.5.8, que foi lançado para uso em produção em 3 de dezembro de 2010. O desenvolvimento ativo para o MySQL 5.5 terminou. </p>
    <p> O MySQL 5.1 alcançou o status de General Availability (GA) com o MySQL 5.1.30, que foi lançado para uso em produção em 14 de novembro de 2008. O desenvolvimento ativo para o MySQL 5.1 terminou. </p>
    <p> O MySQL 5.0 alcançou o status de General Availability (GA) com o MySQL 5.0.15, que foi lançado para uso em produção em 19 de outubro de 2005. O desenvolvimento ativo para o MySQL 5.0 terminou. </p></td>
  </tr>
  <tr>
    <td><td align="left" valign="top"><a name="faq-mysql-why-8.0"></a><a name="id468421"></a><p><b>A.1.2.</b></p></td>
    <td><p> Por que a numeração da versão do MySQL saltou as versões 6 e 7 e foi diretamente para 8.0? </p></td>
  </tr>
  <tr>
    <td><td align="left" valign="top"><a name="faq-mysql-do-subqueries"></a><a name="id468426"></a><p>O MySQL pode fazer subqueries? </p></td>
    <td><p> Sim. Veja <a class="xref" href="subqueries.html" title="15.2.15 Subqueries">Seção 15.2.1