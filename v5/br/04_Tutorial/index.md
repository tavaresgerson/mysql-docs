# Capítulo 3 - Tutoriais

Este capítulo fornece uma introdução tutorial ao MySQL, mostrando como usar o programa cliente **mysql** para criar e usar um banco de dados simples. **mysql** (às vezes referido como o "monitor de terminal" ou simplesmente "monitor") é um programa interativo que permite conectar-se a um servidor MySQL, executar consultas e visualizar os resultados. **mysql** também pode ser usado em modo batch: você coloca suas consultas em um arquivo previamente, e depois diz ao **mysql** para executar o conteúdo do arquivo. Ambos os modos de uso do **mysql** são abordados aqui.

Para ver uma lista de opções fornecidas pelo **mysql**, invoque-o com a opção `--help`:

```sql
$> mysql --help
```

Este capítulo assume que o **mysql** está instalado na sua máquina e que há um servidor MySQL disponível ao qual você pode se conectar. Se isso não for verdade, entre em contato com o administrador do MySQL. (Se você é o administrador, precisa consultar as partes relevantes deste manual, como o Capítulo 5, *Administração do Servidor MySQL*.)

Este capítulo descreve todo o processo de configuração e uso de um banco de dados. Se você está interessado apenas em acessar um banco de dados existente, pode querer ignorar as seções que descrevem como criar o banco de dados e as tabelas que ele contém.

Como este capítulo é de natureza tutorial, muitos detalhes são necessariamente omitidos. Consulte as seções relevantes do manual para obter mais informações sobre os tópicos abordados aqui.