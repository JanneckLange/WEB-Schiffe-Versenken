# WEB-WS17-WebRangers
Repository für WEB im WS17 der Gruppe Web-Rangers von Benjamin Schönke, Max Stockbauer, Janneck Lange


## Suggested Emojis

| Emoji | Raw Emoji Code | Description |
|:---:|:---:|---|
| :art: | `:art:` | Verbesserung von **Format**/Struktur des Codes |
| :newspaper: | `:newspaper:` | Erstellen einer **neue Datei** |
| :pencil: | `:pencil:` | bei **kleinen Änderungen** am Code oder Text |
| :racehorse: | `:racehorse:` | Verbesserung der **performance** |
| :books: | `:books:` | Schreiben von **Kommentar** |
| :bug: | `:bug:` | beim melden eines **bug**, with [`@FIXME`](https://github.com/slashsBin/styleguide-todo-grammar#bug-report)Comment Tag |
| :ambulance: | `:ambulance:` | beim beheben eines **bug** |
| :fire: | `:fire:` | beim **entfernen von Code** oder Datein |
| :tractor: | `:tractor:` | beim **ändern der Dateistruktur**. Usually together with :art: |
| :hammer: | `:hammer:` | when **refactoring** code |
| :umbrella: | `:umbrella:` | hinzufügen von **tests** |
| :microscope: | `:microscope:` | when adding **code coverage** |
| :lock: | `:lock:` | when dealing with **security** |
| :lipstick: | `:lipstick:` | when improving **UI**/Cosmetic |
| :construction: | `:construction:` | **WIP**(Work In Progress) Commits, _maybe_ with `@REVIEW` Comment Tag |
| :gem: | `:gem:` | New **Release** |
| :bookmark: | `:bookmark:` | Version **Tags** |
| :tada: | `:tada:` | **Initial** Commit |
| :speaker: | `:speaker:` | when Adding **Logging** |
| :mute: | `:mute:` | when Reducing **Logging** |
| :sparkles: | `:sparkles:` | when introducing **New** Features |
| :bulb: | `:bulb:` | New **Idea**, with `@IDEA` Comment Tag |
| :ribbon: | `:ribbon:`| Vom **Kunden** gewünschte anpassungen |
| :snowflake: | `:snowflake:` | changing **Configuration**, Usually together with :penguin: or :ribbon: or :rocket: |
| :bank: | `:bank:` | **Generic Database** specific (Migrations, Scripts, Extensions, ...) |
| :handshake: | `:handshake:` | when **Merge files** |


Available Grammar
=================

- `@TODO`: Wenn etwas getan werden muss
- `@FIXME`: Fehler / Error, sollte behoben werden, markiert mit 🐛 Commit
- `@XXX`: Warne andere Programmierer vor problematischem oder irreführenden Code
- `@IDEA`: Eine neue Idee, markiert mit 💡 Commit
- `@HACK`: Kundenanpassung, markiert mit 🎀 Commit
- `@NOTE`: Ein Hinweis auf etwas wichtiges
- `@REVIEW`: Muss geprüft werden, normalerweise markiert mit 🚧 Commit

Bug Report
----------

Add `@FIXME` Comment above SourceCode where Bug/Exception was Occurred.
Write Additional Information:
Steps to Reproduce the Error
Exception Message and Code
Expected Result
Actual Result
Environment Detail
Mention the Task ID in Format `{T###}`.
(optional) Add Screenshots in Format `{F###}`(Phabricator Specific).
Commit the Comments(with 🐛 Emoji), also include Items 2.B, 3 & 4 in Commit Message too.
Award that Task with Manufacturing Defect Token(Phabricator Specific).
Notes

Do NOT edit Contents of Vendor files(Composer, Bower, ...).
Grammars Should Appear in a List/Window in Your IDE of Choice(PHPStorm).
There Must be an Audit for this Bug(Commit) Appear in Phabricator.
These Kind of Bug Reports Remain in History of VCS for future References of that Scope of Code.
All Attached Files & Commit Reference HashTag will be Referenced in the Phabricator Task View.
These Audits May become Tasks Later.
