## 2.5 Instalando o MySQL no Linux

O Linux suporta várias soluções diferentes para instalar o MySQL. Recomendamos que você use uma das distribuições da Oracle, para as quais estão disponíveis vários métodos de instalação:

**Tabela 2.9 Métodos e Informações de Instalação do Linux**

<table>
   <thead>
      <tr>
         <th>Tipo</th>
         <th>Método de Configuração</th>
         <th>Informações Adicionais</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <th>Apt</th>
         <td>Ative o repositório MySQL Apt</td>
         <td>Documentação</td>
      </tr>
      <tr>
         <th>Yum</th>
         <td>Ative o repositório MySQL Yum</td>
         <td>Documentação</td>
      </tr>
      <tr>
         <th>Zypper</th>
         <td>Ative o repositório SLES MySQL</td>
         <td>Documentação</td>
      </tr>
      <tr>
         <th>RPM</th>
         <td>Baixe um pacote específico</td>
         <td>Documentação</td>
      </tr>
      <tr>
         <th>DEB</th>
         <td>Baixe um pacote específico</td>
         <td>Documentação</td>
      </tr>
      <tr>
         <th>Generic</th>
         <td>Baixe um pacote genérico</td>
         <td>Documentação</td>
      </tr>
      <tr>
         <th>Source</th>
         <td>Compile do código-fonte</td>
         <td>Documentação</td>
      </tr>
      <tr>
         <th>Docker</th>
         <td>Use o Oracle Container Registry. Você também pode usar o My Oracle Support para a Edição Empresarial do MySQL.</td>
         <td>Documentação</td>
      </tr>
      <tr>
         <th>Oracle Unbreakable Linux Network</th>
         <td>Use os canais ULN</td>
         <td>Documentação</td>
      </tr>
   </tbody>
</table>

Como alternativa, você pode usar o gerenciador de pacotes do seu sistema para baixar e instalar o MySQL automaticamente com pacotes dos repositórios de software nativo da sua distribuição Linux. Esses pacotes nativos geralmente estão várias versões atrás da versão atualmente disponível. Normalmente, você também não pode instalar versões de inovação, pois elas geralmente não estão disponíveis nos repositórios nativos. Para obter mais informações sobre como usar os instaladores de pacotes nativos, consulte a Seção 2.5.7, “Instalando o MySQL no Linux a partir dos Repositórios de Software Nativo”.

::: info Nota

Para muitas instalações do Linux, você deseja configurar o MySQL para ser iniciado automaticamente quando a máquina for ligada. Muitas das instalações de pacotes nativos realizam essa operação por você, mas para soluções de código-fonte, binários e RPM, você pode precisar configurá-la separadamente. O script necessário, `mysql.server`, pode ser encontrado no diretório `support-files` sob o diretório de instalação do MySQL ou em uma árvore de código-fonte do MySQL. Você pode instalá-lo como `/etc/init.d/mysql` para inicialização e desligamento automáticos do MySQL.

:::